import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchableCBox } from '@/components/widget/SearchableCBox';

export function AddProduct({isOpen, setOpen, restock, id}){ 
    const [price, setPrice] = useState();
    const [name, setName] = useState('');


    // TODO use effect using restock

    return(
        <div
            onClick={() => setOpen(false)}
            className={`overflow-y-auto
                backdrop-blur-sm fixed top-0 left-0 w-screen h-screen z-20 flex items-center justify-center
                transition-opacity duration-200 ease-out
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
        >            
            <div onClick={(e) => e.stopPropagation()} className='flex flex-col bg-primary-light max-w-[500px] rounded-2xl p-5 shadow-md shadow-accent-dark border-primary-dark border-2'>
                {restock ? <span className="font-bold text-2md text-text">Restock</span> : <span className="font-bold text-2md text-text">Add Product</span>}
                <span className="ml-1">
                    <div className="w-full flex flex-row gap-3">
                        <div className="flex flex-col flex-nowrap gap-1">
                            <p className="font-semibold text-sm mt-2 text-text-light">Product name</p>
                            <SearchableCBox
                                name={"Product name"}
                                list={[]}
                                setSelected={(val)=>{setName(val)}}   

                            />
                        </div>
                        <div className="flex flex-col flex-nowrap gap-1">
                            <p className="font-semibold text-sm mt-2 text-text-light">Amount</p>
                            <input 
                                type="number" 
                                className="bg-secondary text-text-dark border-2 border-accent-dark rounded-md mt-1 p-1">
                            </input>
                        </div>
                        
                    </div>
                    <div className="w-full flex flex-row gap-3">
                        <div className="flex flex-col flex-nowrap items-end gap-1 w-full">
                            <p className="font-semibold text-sm mt-2 text-text-light">Amount: Rp. {0}</p>
                        </div>
                    </div>
                    <div className="flex flex-row flex-nowrap justify-between mt-3">
                        <Button onClick={()=>{setOpen(false)}} className='shadow-sm bg-accent-light border-primary-dark border text-text-dark hover:bg-accent-dark transition-color duration-200 ease-in-out'>Close</Button>
                        <Button className='shadow-sm hover:bg-accent-dark transition-colors duration-200 ease-in-out'
                            onClick={() => {
                                // TODO 
                                setOpen(false);
                            }}
                        >
                                Create
                        </Button>
                    </div>   
                </span>       
            </div>
        </div>
    )
}