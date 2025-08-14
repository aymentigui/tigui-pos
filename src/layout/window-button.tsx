import React, { useEffect } from 'react'

export const WinodwButtons = React.memo((props: any) => {

    useEffect(() => {
        (async () => {
            const categories = await window.electron.categories.getAll();
            console.log(categories);
        })();
    }, []);


    return (
        <div className='window-buttons flex '>
            <button className='p-2 flex justify-center items-center' onClick={() => window.electron.minimizeApp()}>-</button>
            <button className='p-2 flex justify-center items-center' onClick={() => window.electron.maximizeApp()}>+</button>
            <button className='p-2 flex justify-center items-center' onClick={() => window.electron.closeApp()}>x</button>
        </div>
    )
})