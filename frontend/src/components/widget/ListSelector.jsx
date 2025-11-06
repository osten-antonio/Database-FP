export function ListSelector({Dialog, items, setItems, itemIDName}){ 
    /*
     using itemIDName because different id format due to primary key (warehouse_id, supplier_id, etc)
    */
    return (<div className="p-2 mt-1 rounded-md w-full bg-secondary border-2 border-accent-dark text-text-dark flex flex-wrap flex-row justify-start gap-2">
        <Dialog/>
        {
            items.map((item)=>{
                return(
                <div key={items[itemIDName]} className="w-fit p-1 bg-accent-light text-text-dark px-2 rounded-md text-sm flex flex-row flex-nowarp gap-2">
                    {item[itemIDName]} - {item.name}
                    <button 
                        className="aspect-square bg-accent-light hover:bg-accent-ui px-1 rounded text-sm"
                        onClick={
                            ()=>{setItems(items.filter((cur)=>(cur!=item)))}
                        }
                    >
                        x
                    </button>
                </div>
                )
            })
        }
    </div>);
}