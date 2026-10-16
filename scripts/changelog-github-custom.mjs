import { getCommitInfo, getPullRequestInfo } from '@changesets/get-github-info';

const changelogFunctions = {
	getDependencyReleaseLine: async (changesets, dependenciesUpdated, options) => {
		if (!options || !options.repo) {
			throw new Error(
				'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]'
			);
		}
		if (dependenciesUpdated.length === 0) return '';

		const changesetLink = `- Updated dependencies [${(
			await Promise.all(
				changesets.map(async (cs) => {
					if (cs.commit) {
						const info = await getCommitInfo({
							repo: options.repo,
							commit: cs.commit
						});
						return info?.commit.markdownLink;
					}
				})
			)
		)
			.filter((_) => _)
			.join(', ')}]:`;

		const updatedDepenenciesList = dependenciesUpdated.map(
			(dependency) => `  - ${dependency.name}@${dependency.newVersion}`
		);

		return [changesetLink, ...updatedDepenenciesList].join('\n');
	},
	getReleaseLine: async (changeset, type, options) => {
		if (!options || !options.repo) {
			throw new Error(
				'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]'
			);
		}

		let prFromSummary;
		let commitFromSummary;
		const usersFromSummary = [];

		const replacedChangelog = changeset.summary
			.replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
				const num = Number(pr);
				if (!isNaN(num)) prFromSummary = num;
				return '';
			})
			.replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
				commitFromSummary = commit;
				return '';
			})
			.replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
				usersFromSummary.push(user);
				return '';
			})
			.trim();

		const [firstLine, ...futureLines] = replacedChangelog.split('\n').map((l) => l.trimEnd());

		const pullLink = await (async () => {
			if (prFromSummary !== undefined) {
				const info = await getPullRequestInfo({
					repo: options.repo,
					pull: prFromSummary
				});
				return info?.pull.markdownLink;
			}
			const commitToFetchFrom = commitFromSummary || changeset.commit;
			if (commitToFetchFrom) {
				const info = await getCommitInfo({
					repo: options.repo,
					commit: commitToFetchFrom
				});
				return info?.pull?.markdownLink;
			}
		})();

		const suffix = pullLink ? ` (${pullLink})` : '';

		return `\n\n- ${firstLine}${suffix}\n${futureLines.map((l) => `  ${l}`).join('\n')}`;
	}
};

export default changelogFunctions;
