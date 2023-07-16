import { config } from "dotenv";
import { getInfo, getInfoFromPullRequest } from "@changesets/get-github-info";
config();
function validate(options) {
  if (!options || !options.repo) {
    throw new Error(
      'Please provide a repo to this changelog generator like this:\n"changelog": ["@svitejs/changesets-changelog-github-compact", { "repo": "org/repo" }]'
    );
  }
}
var changelogFunctions = {
  getDependencyReleaseLine: async (changesets, dependenciesUpdated, options) => {
    validate(options);
    if (dependenciesUpdated.length === 0)
      return "";
    const changesetLink = `- Updated dependencies [${(await Promise.all(
      changesets.map(async (cs) => {
        if (cs.commit) {
          const { links } = await getInfo({
            repo: options.repo,
            commit: cs.commit
          });
          return links.commit;
        }
      })
    )).filter((_) => _).join(", ")}]:`;
    const updatedDepenenciesList = dependenciesUpdated.map(
      (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
    );
    return [changesetLink, ...updatedDepenenciesList].join("\n");
  },
  getReleaseLine: async (changeset, type, options) => {
    validate(options);
    const repo = options.repo;
    let prFromSummary;
    let commitFromSummary;
    const replacedChangelog = changeset.summary.replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
      const num = Number(pr);
      if (!isNaN(num))
        prFromSummary = num;
      return "";
    }).replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
      commitFromSummary = commit;
      return "";
    }).replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, "").trim();
    const linkifyIssueHints = (line) => line.replace(/(?<=\( ?(?:fix|fixes|see) )(#\d+)(?= ?\))/g, (issueHash) => {
      return `[${issueHash}](https://github.com/${repo}/issues/${issueHash.substring(1)})`;
    });
    const [firstLine, ...futureLines] = replacedChangelog.split("\n").map((l) => linkifyIssueHints(l.trimRight()));
    const links = await (async () => {
      if (prFromSummary !== void 0) {
        let { links: links2 } = await getInfoFromPullRequest({
          repo,
          pull: prFromSummary
        });
        if (commitFromSummary) {
          links2 = {
            ...links2,
            commit: `[\`${commitFromSummary}\`](https://github.com/${repo}/commit/${commitFromSummary})`
          };
        }
        return links2;
      }
      const commitToFetchFrom = commitFromSummary || changeset.commit;
      if (commitToFetchFrom) {
        const { links: links2 } = await getInfo({
          repo,
          commit: commitToFetchFrom
        });
        return links2;
      }
      return {
        commit: null,
        pull: null,
        user: null
      };
    })();
    const suffix = links.pull ? ` (${links.pull})` : links.commit ? ` (${links.commit})` : "";
    return `
- ${firstLine}${suffix}
${futureLines.map((l) => `  ${l}`).join("\n")}`;
  }
};
var src_default = changelogFunctions;
export {
  src_default as default
};