// Backup preview-link comment for pull requests.
//
// Cloudflare's own bot comments the preview URL on each PR, but that comment
// can arrive minutes after the build (or not update for later pushes). This
// runs when Cloudflare's "Workers Builds" check finishes and keeps ONE comment
// per PR up to date with the preview link, the build result and its logs.
//
// The preview URL follows Cloudflare's pattern for Worker Previews on
// workers.dev: <branch name with dashes>-<worker>.<subdomain>.workers.dev
// e.g. feat/order-history-ui -> feat-order-history-ui-e-sweet.learnsmartng.workers.dev

const WORKER = "e-sweet";
const SUBDOMAIN = "learnsmartng";
const MARKER = "<!-- e-sweet-preview-link -->";
// DNS labels are limited to 63 characters.
const MAX_LABEL = 63;

const previewName = (branch = "") =>
  branch
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const previewUrl = (branch) =>
  `https://${previewName(branch)}-${WORKER}.${SUBDOMAIN}.workers.dev`;

const OUTCOME = {
  failure: "failed",
  cancelled: "was cancelled",
  timed_out: "timed out",
  action_required: "needs attention",
  skipped: "was skipped",
  stale: "went stale",
};

const commentBody = ({ branch, sha, conclusion, logsUrl }) => {
  const url = previewUrl(branch);
  const label = `${previewName(branch)}-${WORKER}`;
  const short = (sha || "").slice(0, 7);
  const ok = conclusion === "success";

  const lines = [
    MARKER,
    "### 🔍 Preview for this PR",
    "",
    `**Preview link:** ${url}`,
    "",
    ok
      ? `✅ Cloudflare build succeeded for \`${short}\`. The link shows this commit. [Build logs](${logsUrl})`
      : `❌ Cloudflare build **${OUTCOME[conclusion] || "did not finish"}** for \`${short}\`. The link still shows the last successful build. [Build logs](${logsUrl})`,
    "",
    "Before approving, open it on a phone-sized screen and on desktop and try the flows this PR changes.",
  ];

  if (label.length > MAX_LABEL) {
    lines.push(
      "",
      "⚠️ This branch name is long, so Cloudflare may shorten the preview address. If the link doesn't open, use the link in Cloudflare's own comment or the build logs.",
    );
  }

  lines.push(
    "",
    "<sub>Posted by the Preview link workflow as a backup to Cloudflare's comment, which can take a few minutes. It updates on every push.</sub>",
  );
  return lines.join("\n");
};

// Entry point for actions/github-script.
const run = async ({ github, context, core }) => {
  const check = context.payload.check_run;
  const { owner, repo } = context.repo;

  // GitHub fills this in for open PRs from branches in this repo. If it's
  // ever empty, look the PR up from the commit instead.
  let prs = check?.pull_requests ?? [];
  if (prs.length === 0 && check?.head_sha) {
    const { data } =
      await github.rest.repos.listPullRequestsAssociatedWithCommit({
        owner,
        repo,
        commit_sha: check.head_sha,
      });
    prs = data.filter(
      (pr) =>
        pr.state === "open" && pr.head.repo?.full_name === `${owner}/${repo}`,
    );
  }
  if (prs.length === 0) {
    core?.info(
      "No open pull request for this check run (e.g. a push to main).",
    );
    return;
  }

  for (const pr of prs) {
    const body = commentBody({
      branch: pr.head.ref,
      sha: check.head_sha,
      conclusion: check.conclusion,
      logsUrl: check.details_url,
    });

    const comments = await github.paginate(github.rest.issues.listComments, {
      owner,
      repo,
      issue_number: pr.number,
      per_page: 100,
    });
    const existing = comments.find((comment) => comment.body?.includes(MARKER));

    if (existing) {
      await github.rest.issues.updateComment({
        owner,
        repo,
        comment_id: existing.id,
        body,
      });
      core?.info(`Updated preview comment on #${pr.number}`);
    } else {
      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: pr.number,
        body,
      });
      core?.info(`Posted preview comment on #${pr.number}`);
    }
  }
};

module.exports = run;
module.exports.previewName = previewName;
module.exports.previewUrl = previewUrl;
module.exports.commentBody = commentBody;
module.exports.MARKER = MARKER;
