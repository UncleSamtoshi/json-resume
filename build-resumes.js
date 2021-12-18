const Handlebars = require("handlebars")
const fs = require('fs')
require('dotenv').config()
const { exec } = require("child_process")

// Config for resumes
const baseResumeTemplatePath = "./resume-base.json"
const templateParameters = {
    email: process.env.email
}
const filters = {
    noTwitter: (resume => ({...resume,basics:{...resume.basics,profiles:(resume.basics.profiles.filter(profile => (profile.network != "Twitter")))}})),
    noEducation: (resume => ({...resume,education:[]})),
    noEmail: (resume => ({...resume,basics:{...resume.basics,email:""}}))
}
const resumeDefinitions = [
    {
        name: "BitcoinResume",
        filters: [
        ],
        theme:"jsonresume-theme-onepage"
    },
    {
        name: "SamuelPetersStrikeResume",
        filters: [
            filters.noEducation
        ],
        theme:"jsonresume-theme-onepage"
    },
    {
        name: "SamuelPetersBitcoinResume",
        filters: [
        ],
        theme:"jsonresume-theme-even"
    }
]

// Apply Handlebars template parameters
const baseResumeTemplate = fs.readFileSync(baseResumeTemplatePath, "utf8")
var template = Handlebars.compile(baseResumeTemplate)
const baseResumePostTemplate = template(templateParameters)
const baseResumeObject = JSON.parse(baseResumePostTemplate)

// Create resumes base on individual definitions
const filterResume = (resume, filters) => {
    var newResume = {...resume}
    filters.forEach(singleFilter => {newResume = singleFilter(newResume)})
    return newResume
}
const resumes = resumeDefinitions.map(def => ({...def,resumeJson:filterResume(baseResumeObject,def.filters)}))

// Create HTML files
resumes.forEach(resume => {
    fs.writeFileSync(`${resume.name}.json`,JSON.stringify(resume.resumeJson))
    exec(`resume export -r ${resume.name}.json -f html public/${resume.name}.html ${resume.theme ? `-t ${resume.theme}` : ""}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        fs.rmSync(`${resume.name}.json`)
    });
})

