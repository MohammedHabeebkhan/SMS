import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import Link from 'next/link'
import { DataContext } from '../store/GlobalState'
import { getData } from '../utils/fetchData'
import InfoModal from '../components/InfoModal/respModal'
import ViewTeacher from './ViewTeacher/[id]'

const teachers = () => {
  const { state, dispatch } = useContext(DataContext)
  const { auth } = state
  const isAdmin = auth && auth.user && auth.user.role === 'admin'
  const [open, setOpen] = useState(false)
  const [id, setId] = useState('')
  
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    getTeachersData();
  }, [teachers])

  const getTeachersData=()=>{
    getData('teachers', auth.token)
    .then(res => {
      if (res.err) setTeachers([]);
      else {
        setTeachers(res.teachers);
      }
    })
  }

  const getViewTeacher = (teacher) => {
    setOpen(true)
    setId(teacher._id)
  }

  return (
    <div className="container">
      <h2 style={{ marginTop: '3%' }}>Teachers Information</h2>
      {isAdmin && <Link href={`/create/teacher`}><a className="btn btn-success" style={{ float: 'right', margin: '0 0 1% 0' }}>Add New Teacher</a></Link>
      }
      <div className="table-responsive paper">
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Teacher Name</th>
              <th>Father Name</th>
              <th>Block</th>
              <th>Email</th>
              <th>PhoneNo</th>
              {isAdmin &&
                <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {
              teachers && teachers.length !== 0 ? teachers.map((teacher, index) => (

                <tr key={teacher._id}>
                  <td>{index + 1}</td>
                  <td>{teacher.firstname + " " + teacher.middlename + " " + teacher.lastname}</td>
                  <td>{teacher.fathername}</td>
                  <td>{teacher.branch}</td>
                  <td>{teacher.emailid}</td>
                  <td>{teacher.contactnumber}</td>

                  {isAdmin && <td>
                    <div className="row">
                      <i className="fas fa-eye text-black mr-3" onClick={() => getViewTeacher(teacher)} title="View"></i>
                      <Link href={`/create/teacher/${teacher._id}`}><i className="fas fa-edit text-info mr-1" title="Edit"></i></Link>
                      <i className="fas fa-trash-alt text-danger ml-2" title="Remove" data-toggle="modal" data-target="#exampleModal"
                        onClick={() => dispatch({
                          type: 'ADD_MODAL',
                          payload: [{
                            data: '', id: teacher._id,
                            title: teacher.firstname + " " + teacher.middlename + " " + teacher.lastname,
                            type: 'DELETE_TEACHER'
                          }]
                        })}></i>
                    </div>
                  </td>}
                </tr>)) : <h5 style={{marginTop:'10%'}}>Please Add Teachers</h5>
            }
          </tbody>
        </table>
      </div>
      <InfoModal open={open} setOpen={setOpen}>
        <div>
          <h2>Teacher Info</h2>
          <ViewTeacher id={id} />

        </div>
      </InfoModal>
    </div>
  )
}
export default teachers