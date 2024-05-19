import Image from 'next/image'

export default function JobCard({ company, location, date, year, image,position,  bullet = [] }) {

	const logo = require(`../assets/${image}`)

	return (
		<>
			<div className={"row-span-2 card-bg p-5 text-white "} >
				<header className='flex flex-row space-x-5'>
					<div className=' w-[15%] sm:w-[5%]'>
						<Image src={logo}  alt={`${company} logo`} />
					</div>
					<div className='w-[75%] sm:w-[95%]'>
						<div className='flex flex-row justify-between'>
							<p className="text-xs text-zinc-100 pb-2">{date}</p>
							<p className="text-xs text-zinc-500">{year}</p>
						</div>
						<a href="https://www.virtuollis.com/" className='text-xl font-bold text-zinc-100 group-hover:text-white font-display'> {position} @ {company}</a>
						<p className="text-xs text-zinc-500 pt-2">{location}</p>

						<ol className='mt-5 flex flex-col space-y-5 text-sm md:text-lg'>
							{bullet.map((point, index) => (
								<li key={index} className='flex flex-col'>
									{point}
								</li>
							))}
						</ol>
					</div>
				</header>

				<div>
				</div>
			</div>
		</>
	)
}
