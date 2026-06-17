import React, { useState, useRef } from "react"
import "../style/home.css"
import { useInterview } from "../hooks/useInterview.js"
import { useNavigate } from "react-router"


const Home = () => {

    const { loading, generateReport, reports } = useInterview()

    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)

    const resumeInputRef = useRef()

    const navigate = useNavigate()


    const handleFileChange = (e) => {

        const file = e.target.files[0]

        console.log("Selected file:", file)

        if (!file) {
            return
        }


        if (file.type !== "application/pdf") {
            alert("Only PDF files allowed")
            e.target.value = ""
            return
        }


        setSelectedFile(file)
    }



    const handleGenerateReport = async () => {


        if (!selectedFile && !selfDescription) {

            alert(
                "Upload resume or enter self description"
            )

            return
        }


        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile: selectedFile
        })


        if (data) {
            navigate(`/interview/${data._id}`)
        }

    }



    if (loading) {

        return (
            <main className="loading-screen">
                <h1>
                    Loading your interview plan...
                </h1>
            </main>
        )
    }



    return (

        <div className="home-page">


            <header className="page-header">

                <h1>
                    Create Your Custom
                    <span className="highlight">
                        {" "}Interview Plan
                    </span>
                </h1>


                <p>
                    Let our AI analyze the job requirements and your profile.
                </p>

            </header>



            <div className="interview-card">


                <div className="interview-card__body">


                    {/* JOB DESCRIPTION */}

                    <div className="panel panel--left">

                        <div className="panel__header">

                            <h2>
                                Target Job Description
                            </h2>

                        </div>


                        <textarea

                            onChange={
                                e =>
                                    setJobDescription(e.target.value)
                            }

                            className="panel__textarea"

                            placeholder="Paste job description..."

                        />


                    </div>





                    {/* PROFILE */}


                    <div className="panel panel--right">


                        <div className="panel__header">

                            <h2>
                                Your Profile
                            </h2>

                        </div>




                        <div className="upload-section">


                            <label
                                className="section-label"
                            >
                                Upload Resume
                            </label>



                            <label
                                className="dropzone"
                                htmlFor="resume"
                            >

                                <p>
                                    Click to upload PDF
                                </p>


                                {
                                    selectedFile &&
                                    (
                                        <p>
                                            {selectedFile.name}
                                        </p>
                                    )
                                }



                                <input

                                    ref={resumeInputRef}

                                    id="resume"

                                    name="resume"

                                    type="file"

                                    accept="application/pdf"

                                    onChange={handleFileChange}

                                />


                            </label>


                        </div>





                        <div className="or-divider">

                            <span>
                                OR
                            </span>

                        </div>





                        <div className="self-description">


                            <label className="section-label">

                                Quick Self-Description

                            </label>



                            <textarea


                                onChange={
                                    e =>
                                        setSelfDescription(
                                            e.target.value
                                        )
                                }


                                className="panel__textarea panel__textarea--short"


                                placeholder="Describe yourself..."

                            />


                        </div>



                    </div>



                </div>





                <div className="interview-card__footer">


                    <button

                        onClick={handleGenerateReport}

                        className="generate-btn"

                    >

                        Generate My Interview Strategy

                    </button>


                </div>



            </div>






            {
                reports.length > 0 &&

                (

                    <section className="recent-reports">


                        <h2>
                            My Recent Interview Plans
                        </h2>



                        <ul className="reports-list">


                            {
                                reports.map(report => (

                                    <li

                                        key={report._id}

                                        className="report-item"

                                        onClick={
                                            () =>
                                                navigate(
                                                    `/interview/${report._id}`
                                                )
                                        }

                                    >

                                        <h3>
                                            {report.title || "Untitled"}
                                        </h3>


                                        <p>
                                            Match Score:
                                            {" "}
                                            {report.matchScore}%
                                        </p>


                                    </li>

                                ))
                            }


                        </ul>


                    </section>

                )

            }



        </div>

    )

}


export default Home