<script>
	import ThemeSwitch from './ThemeSwitch.svelte';
</script>

<header>
	<div
		class="fixed top-0 z-30 w-full flex-none transform-gpu transition-transform duration-150 ease-out bg-transparent backdrop-blur dark:bg-transparent translate-y-0 border-b border-b-gray-400 dark:border-b-gray-50"
	>
		<div
			class="flex w-full flex-col items-center justify-center mx-auto container p-[1.25rem_0] h-[5rem]"
		>
			<div class="flex w-full items-center">
				<h1 class="text-2xl">SVELTE-TEL-INPUT</h1>
				<div class="flex-1" />
				<div class="lg:hidden -mr-2 flex items-center">
					<div class="relative inline-block text-left not-prose">
						<button
							id="popover-button-1"
							type="button"
							class="inline-flex w-full justify-center rounded-md p-2 text-lg font-medium hover:text-gray-400"
							aria-controls="popover-1"
							aria-expanded="false"
							aria-haspopup="true"
						>
							<svg
								preserveAspectRatio="xMidYMid meet"
								viewBox="0 0 24 24"
								width="30"
								height="30"
							>
								<path
									fill="currentColor"
									d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z"
								/>
							</svg>
							<span class="sr-only">Main navigation menu</span>
						</button>
						<div
							class="fixed top-0 left-0 bg-transparent backdrop-blur-sm dark:bg-transparent transition-opacity duration-75 pointer-events-auto z-40 w-screen h-screen opacity-0 invisible"
						/>
						<div hidden={null} />
						<div
							id="popover-1"
							class="absolute -top-4 -right-5 min-w-[340px] p-5 pt-4 origin-top-right z-50 invisible transition transform ease-out duration-150 opacity-0 scale-95"
							tabindex="-1"
							role="dialog"
							hidden={null}
						>
							<div
								class="flex min-h-[60px] flex-col overflow-hidden rounded-md border border-gray-divider bg-gray-500 shadow-md"
							>
								<div class="flex items-center z-20">
									<div class="flex-1" />
									<button
										class="p-4 text-gray-soft hover:text-gray-inverse mt-[0.125rem] mr-[0.125rem] pointer-events-none"
									>
										<svg
											preserveAspectRatio="xMidYMid meet"
											viewBox="0 0 24 24"
											width="24"
											height="24"
										>
											<path
												fill="currentColor"
												d="m12 10.586l4.95-4.95l1.414 1.414l-4.95 4.95l4.95 4.95l-1.414 1.414l-4.95-4.95l-4.95 4.95l-1.414-1.414l4.95-4.95l-4.95-4.95L7.05 5.636z"
											/>
										</svg>
										<span class="sr-only">Close dialog</span>
									</button>
								</div>
								<div class="px-4 pt-2.5 pb-6 -mt-[2.5rem]">
									<section class="flex flex-col items-start">
										<h1 class="mb-6 text-xl font-medium">Links</h1>
										<nav>
											<ul>
												<li class="mt-4 first:mt-0 lg:mt-0">
													<a
														class="p-1 border-b hover:border-b-2 border-brand text-gray-inverse"
														href="https://github.com/gyurielf/svelte-tel-input"
													>
														Documentation
													</a>
												</li>
											</ul>
										</nav>
									</section>
									<hr
										class="my-6 h-2 w-full border-t-2 border-dashed border-gray-200 dark:border-gray-400"
									/>
									<section class="flex flex-col items-start">
										<h1 class="mb-6 text-xl font-medium">Options</h1>
										<div class="flex flex-col space-y-6">
											<div class="flex items-center">
												Theme

												<label
													class="relative ml-4 flex items-center border border-gray-200 px-4 py-1 dark:border-gray-400 rounded-md focus-within:ring-2"
													style="--tw-ring-color:var(--kd-color-focus);"
												>
													<span class="sr-only">Theme</span> Dark
													<svg
														preserveAspectRatio="xMidYMid meet"
														viewBox="0 0 24 24"
														width="20"
														height="20"
														class="ml-1"
														><path
															fill="currentColor"
															d="m12 14l-4-4h8z"
														/></svg
													>
													<select
														class="absolute inset-0 appearance-none opacity-0"
													>
														<option value="light">Light</option>
														<option value="dark">Dark</option>
														<option value="system">System</option>
													</select></label
												>
											</div>
										</div>
									</section>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="lg:flex lg:items-center hidden">
					<div class="hidden lg:flex items-center">
						<div class="socials svelte-cif352">
							<a
								class="relative flex items-center text-gray-soft hover:text-gray-inverse border-0 rounded-md p-2"
								href="https://github.com/gyurielf/svelte-tel-input"
								target="_blank"
							>
								<svg
									preserveAspectRatio="xMidYMid meet"
									viewBox="0 0 24 24"
									width="28"
									height="28"
									class=""
								>
									<path
										fill="currentColor"
										d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
									/>
								</svg>
								<span class="sr-only">GitHub</span>
							</a>
						</div>
						<ThemeSwitch />
					</div>
				</div>
			</div>
		</div>
	</div>
</header>
