import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import Link from 'next/link'
import { DataContext } from '../store/GlobalState'
import { getData } from '../utils/fetchData'
// import { students } from '../pages/api/students'


import InfoModal from '../components/InfoModal/respModal'
import ViewStudent from './viewStudent/[id]'
import { forEach } from 'lodash'

const Students = () => {
  const { state, dispatch } = useContext(DataContext)
  const { auth } = state
  const isAdmin = auth && auth.user && auth.user.role === 'admin'
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false)
  const [id, setId] = useState('')
  const [searchByStudName, setSearchByStudName] = useState('');
  const [searchByFatherName, setSearchByFatherName] = useState('');


  useEffect(() => {
    getStudentsData();
  }, [students])

  const getStudentsData = () => {
    getData('students', auth.token)
      .then(res => {
        if (res.err) setStudents([]);
        else {
          setStudents(res.students);
        }
      })
  }
  const getViewStudent = (stud) => {
    setOpen(true)
    setId(stud._id)
  }



  return (
    <div className="container">
      <div className='app-header'><h2>Students Information</h2></div>
      {isAdmin && <Link href={`/create`}><a className="btn btn-success" style={{ float: 'right', margin: '0 0 1% 0' }}>Add New Student</a></Link>}
      <div style={{ display: 'flex' }}>
        <div><input type="text" name="studentName" className="form-control" placeholder='Search by student name' onChange={(e) => { setSearchByStudName(e.target.value) }} maxLength='25' required /></div>
        <div><input type="text" name="fatherName" className="form-control" placeholder='Search by father name' onChange={(e) => { setSearchByFatherName(e.target.value) }} maxLength='25' required /></div>
        <div><input type="text" name="class&section" className="form-control" placeholder='Search by class & section' onChange={(e) => { setSearchByStudName(e.target.value) }} maxLength='25' required /></div>

      </div>
      <div className="table-responsive paper">
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Student Name</th>
              <th>Father Name</th>
              <th>Class & Section</th>
              <th>Roll No</th>
              <th>Phone No</th>
              {isAdmin &&
                <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {
              students && students.length !== 0 ? students.filter((val) => { let fullname = val.firstname + " " + val.middlename + " " + val.lastname; if (searchByStudName !== "") {if(fullname.toLowerCase().includes(searchByStudName.toLowerCase())) { return val }} else if(val.fathername.toLowerCase().includes(searchByFatherName)){return val}}).map((stud, index) => (
                // students && students.length !== 0 ? students.filter((val) => {if(searchByStudName == " " || searchByFatherName == " ") {return val}}).map((stud, index) => (

                <tr key={stud._id}>
                  <td>{index + 1}</td>
                  <td>{stud.firstname + " " + stud.middlename + " " + stud.lastname}</td>
                  <td>{stud.fathername}</td>
                  <td>{stud.Class + " " + stud.section}</td>
                  <td>{stud.rollno}</td>
                  <td>{stud.fathermobilenumber}</td>

                  {isAdmin && <td>
                    <div className="row">
                      <i className="fas fa-eye text-black mr-3" onClick={() => getViewStudent(stud)} title="View"></i>
                      <Link href={`/create/${stud._id}`}><i className="fas fa-edit text-info mr-1" title="Edit"></i></Link>
                      <i className="fas fa-trash-alt text-danger ml-2" title="Remove" data-toggle="modal" data-target="#exampleModal"
                        onClick={() => dispatch({
                          type: 'ADD_MODAL',
                          payload: [{
                            data: '', id: stud._id,
                            title: stud.firstname + " " + stud.middlename + " " + stud.lastname,
                            type: 'DELETE_STUDENT'
                          }]
                        })}></i>
                    </div>
                  </td>}
                </tr>)) : <h5 style={{ marginTop: '10%' }}>Please Add Students</h5>
            }
          </tbody>
        </table>
      </div>
      <InfoModal open={open} setOpen={setOpen}>
        <div>
          <h2>Student Info</h2>
          <ViewStudent id={id} />

        </div>
      </InfoModal>
    </div>
  )
}
export default Students