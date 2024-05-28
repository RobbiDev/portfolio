/**
 * JobCard component displays detailed information about a job experience.
 * @component
 * @param {Object} props - The props object containing details of the job.
 * @param {string} props.company - The name of the company where the job was held.
 * @param {string} props.location - The location (city, state) of the job.
 * @param {string} props.date - The specific date (e.g., "April 2023") of the job.
 * @param {string} props.year - The year (e.g., "2023") of the job.
 * @param {string} props.image - The logo or image associated with the company.
 * @param {string} props.position - The job title or position held.
 * @param {string} props.summary - A brief summary or description of the job responsibilities.
 * @returns {JSX.Element} - JobCard component with job details.
 */
export default function JobCard({ company, location, date, year, image, position, summary }) {
    return (
        <>
            <div className={"row-span-2 card-bg p-5 text-white shadow-xl"}>
                <header className='flex flex-row space-x-5'>
                    <div className=''>
                        {/* Date and Year */}
                        <div className='flex flex-row justify-between'>
                            <p className="text-xs text-zinc-100 pb-2">{date}</p>
                            <p className="text-xs text-zinc-500">{year}</p>
                        </div>

                        {/* Position and Company */}
                        <a className='text-xl font-bold text-zinc-100 group-hover:text-white font-display'>
                            {position} @ {company}
                        </a>

                        {/* Location */}
                        <p className="text-xs text-zinc-500 pt-2">{location}</p>

                        {/* Summary */}
                        <p className='mt-5 flex flex-col space-y-5 font-md text-zinc-300'>
                            {summary}
                        </p>
                    </div>
                </header>

                {/* Placeholder for additional content like image or details */}
                <div>
                    {/* Placeholder for additional content */}
                </div>
            </div>
        </>
    );
}
