import React from 'react'
import { WinodwButtons } from './window-button'

export default React.memo((props:any)=>{
        return (
            <div className='bg-red-50 p-16'>
                <WinodwButtons />
            </div>
        )
})