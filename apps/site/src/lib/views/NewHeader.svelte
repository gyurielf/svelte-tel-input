<script lang="ts">
	import { navigating } from '$app/stores';
	import { clickOutsideAction } from '$lib/utils/directives/clickOutsideAction';
	import NavLink from '$lib/components/NavLink.svelte';
	import ThemeSwitch from './ThemeSwitch.svelte';

	let mobileMenuIsOpen = false;

	const closeMobileMenu = () => {
		if (!mobileMenuIsOpen) return;
		mobileMenuIsOpen = false;
	};

	$: $navigating, (mobileMenuIsOpen = false);
</script>

<header
	class="fixed top-0 z-30 w-full flex-none transform-gpu transition-transform duration-150 ease-out bg-transparent backdrop-blur translate-y-0 border-b border-b-gray-400 dark:border-b-gray-50"
>
	<nav class="bg-transparent" use:clickOutsideAction={closeMobileMenu}>
		<div
			class="container flex flex-wrap justify-between items-center mx-auto px-3 xs:px-0 md:px-4 lg:px-0"
		>
			<a href="/" class="flex items-center">
				<span class="sr-only md:not-sr-only text-3xl font-black">SVELTE-TEL-INPUT</span>
			</a>
			<div class="lg:hidden">
				<button
					class="text-gray-900 dark:text-gray-200 w-10 h-10 relative focus:outline-none"
					on:click={() => {
						mobileMenuIsOpen = !mobileMenuIsOpen;
					}}
				>
					<div
						class="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
					>
						<span class="sr-only"
							>{mobileMenuIsOpen ? 'Close main menu' : 'Open main menu'}</span
						>
						<span
							aria-hidden="true"
							class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out {mobileMenuIsOpen
								? 'rotate-45'
								: '-translate-y-1.5'}"
						/>
						<span
							aria-hidden="true"
							class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out {mobileMenuIsOpen
								? 'opacity-0'
								: ''}"
						/>
						<span
							aria-hidden="true"
							class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out {mobileMenuIsOpen
								? '-rotate-45'
								: 'translate-y-1.5'}"
						/>
					</div>
				</button>
			</div>
			<div
				class="w-full {mobileMenuIsOpen ? 'block' : 'hidden'} lg:block lg:w-auto"
				id="navbar-default"
			>
				<ul
					class="flex flex-col px-2 lg:px-4 py-6 mt-4 bg-transparent text-gray-900 lg:flex-row lg:space-x-5 xl:space-x-14
                    lg:mt-0 lg:text-sm lg:font-medium lg:bg-transparent items-center gap-0 font-bold"
				>
					<li>
						<NavLink href="/" class="block py-2 pr-4 pl-3 text-xl rounded lg:p-0"
							>Features</NavLink
						>
					</li>
					<li>
						<NavLink
							href="/how-to-setup"
							class="hidden xl:block py-2 pr-4 pl-3 text-xl rounded lg:p-0"
							>How to Set up</NavLink
						>
					</li>
					<li>
						<NavLink
							href="/contact-us"
							class="block py-2 pr-4 pl-3 text-xl rounded lg:p-0">Contact Us</NavLink
						>
					</li>
					<li>
						<ThemeSwitch />
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>
