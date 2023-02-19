<script>
	let visible = true;
	export let data;
	let images = data.images;
</script>

<div class="flex flex-col justify-center items-center">
	<h1 class="text-gray-900 text-4xl font-bold underline">
		{images.length} Images generated!
	</h1>
</div>

<div class="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
	<div
		class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
	>
		{#each images as image, index (image)}
			<div class="group">
				<div
					class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 xl:aspect-w-7 xl:aspect-h-8"
				>
					<img
						loading="lazy"
						src={image}
						alt={image}
						class="duration-700 ease-in-out hover:opacity-75 group-hover:scale-105 blur-0 grayscale-0 rounded-md"
					/>
				</div>
				<h3 class="mt-4 text-sm text-gray-700">{image.split("_")?.at(0)}</h3>
				<p class="mt-1 text-lg font-medium text-gray-900">Image created at: {new Date(image.split("_")?.at(1).split(".")?.[0]*1000).toString().slice(0,25)}</p>
			</div>
		{/each}
	</div>
</div>
