import CFA from '@/assets/cfa.png'
import Image from 'next/image'

const roles = {

	"cfa": [

	],
	"virtuollis": [

	]

}

export default function JobCard({ title, location, date, year, image }) {

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
						<h1 className='text-xl font-bold text-zinc-100 group-hover:text-white font-display'>{title}</h1>
						<p class="text-xs text-zinc-500 pt-2">{location}</p>

						<div className='mt-5 flex flex-col space-y-1'>

							<h1>BOH Supervisor</h1>
							<p class="text-xs text-zinc-500 ">Jan 2023 - Present</p>

						</div>
					</div>
				</header>

				<div>

				</div>

			</div>
		</>
	)
}
