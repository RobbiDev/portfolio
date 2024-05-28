import Image from 'next/image'

export default function JobCard({ company, location, date, year, image,position,  summary }) {

	const logo = require(`../assets/${image}`)

	return (
		<>
			<div className={"row-span-2 card-bg p-5 text-white shadow-xl"} >
				<header className='flex flex-row space-x-5'>
					<div className=''>
						
						<div className='flex flex-row justify-between'>
							<p className="text-xs text-zinc-100 pb-2">{date}</p>
							<p className="text-xs text-zinc-500">{year}</p>
						</div>

						<a className='text-xl font-bold text-zinc-100 group-hover:text-white font-display'> {position} @ {company}</a>
						<p className="text-xs text-zinc-500 pt-2">{location}</p>

						<p className='mt-5 flex flex-col space-y-5 font-md text-zinc-300'>
							{summary}
						</p>
					</div>
				</header>

				<div>
				</div>
			</div>
		</>
	)
}
