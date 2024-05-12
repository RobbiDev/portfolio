import CFA from '@/assets/cfa.png'
import Image from 'next/image'

import data from '@/data/jobs.json'


export default function JobCard({ title, location, date, year, image, fruits }) {

	console.log(fruits)

	return (
		<>
			<div className={"row-span-2 card-bg p-5 text-white "} >
				<header className='flex flex-row space-x-5'>
					<div className=' w-[15%] sm:w-[5%]'>
						<Image src={image} />
					</div>
					<div className='w-[75%] sm:w-[95%]'>
						<div className='flex flex-row justify-between'>
							<p class="text-xs text-zinc-100 pb-2">{date}</p>
							<p class="text-xs text-zinc-500">{year}</p>
						</div>
						<a href="https://www.virtuollis.com/" className='text-xl font-bold text-zinc-100 group-hover:text-white font-display'>{title}</a>
						<p class="text-xs text-zinc-500 pt-2">{location}</p>

						<ul className='mt-5 flex flex-col space-y-5'>

							<ul>
								{fruits.map((fruit, index) => (
									<li key={index}>{fruit}</li>
								))}
							</ul>

							{/* <li className='flex flex-col'>
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{roles[1].title}</h3>
								<time class="text-sm font-normal text-zinc-500">hi</time>
							</li> */}




						</ul>
					</div>
				</header>

				<div>

				</div>

			</div>
		</>
	)
}
