export default function Card({ title, date, views, desc, link }) {

	return (
		<>
			<a href={link} target="_blank" className={"card-bg p-5 text-white gap-y-2"} >
				<div className='flex flex-row justify-between'>
					<p class="text-xs text-zinc-100">{date}</p>
					<p class="text-xs text-zinc-500">{views}</p>
				</div>
				<h1 className='mt-4 text-xl font-bold text-zinc-100 group-hover:text-white font-display'>{title}</h1>
				<p className='mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300'>{desc}</p>

			</a>
		</>
	)
}
