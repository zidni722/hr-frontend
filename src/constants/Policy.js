import React from 'react';
export const Leave  = () =>  {
    
        return(
           <div>
                <ol>
                    <li>Employees are allowed to take annual leave after successfully passed the probation period (3 months).</li>
                    <li>Employees are required to submit leave request to obtain Lead's approval by the latest 2 weeks before taking leave.</li>
                    <li>Leave request that is submitted less than a week, will be considered as Emergency Leave and still counted as Annual Leave.</li>
                    <li>Employees are required to submit sick letter if they take sick leave more than <b>1 day</b>.</li>
                    <li>If Leave Type is not included in list so leave type is <b>Cuti Tahunan</b>.</li>
                </ol>
           </div>
        );
    
}