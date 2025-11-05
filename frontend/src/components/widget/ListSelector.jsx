export function ListSelector({Dialog, items, setItems, itemIDName}){ 
    /*
     using itemIDName because different id format due to primary key (warehouse_id, supplier_id, etc)
    */
    return (<div className="p-2 mt-1 rounded-md w-full bg-accent-dark border-accent-ui text-text-dark flex flex-wrap flex-row justify-start gap-2">
        <Dialog/>
        {
            items.map((item)=>{
                return(
                <div key={items[itemIDName]} className="w-fit p-1 bg-primary text-text px-2 rounded-md text-sm flex flex-row flex-nowarp gap-2">
                    {item[itemIDName]} - {item.name}
                    <button 
                        className="aspect-square bg-primary hover:bg-accent-ui px-1 rounded text-sm"
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