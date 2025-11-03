import Link from 'next/link'

export function SidebarButton({Icon,label,route,pathname}){
    return (
        <li>
            <button className=
                {`p-2 px-7 rounded-sm w-full my-2
                    ${pathname === `${route}` ? 'bg-selected' : 'bg-primary-light'}    
                `}
            >
                <Link className='flex gap-2 font-semibold' href={`${route}`}>
                <Icon></Icon>
                    {label}
                </Link>
            </button>
        </li>
    )
}

