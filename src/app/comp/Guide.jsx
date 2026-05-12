import React from 'react'
import { FiX } from 'react-icons/fi'


function Guide({children}) {
    return (
        <>
          

            <div className="samplePopup">

                {/* <button className="sampleClose" onClick={() => setSamplePopup(false)}>
                    <FiX />
                </button> */}
                {children}
                

            </div>

        </>
    )
}

export default Guide