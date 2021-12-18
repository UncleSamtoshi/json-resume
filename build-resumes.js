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
    noTwitter: (resume => ({...resume,basics:{...resume.basics,profiles:(resume.basics.profiles.filter(profile => (profile.network != "Twitter")))}}))
}
const resumeDefinitions = [
    {
        name: "BitcoinResume",
        filters: [
        ]
    },
    {
        name: "SamuelPetersStrikeResume",
        filters: [
            filters.noTwitter
        ]
    }
]

// Apply Handlebars template parameters
const baseResumeTemplate = fs.readFileSync(baseResumeTemplatePath, "utf8")
var template = Handlebars.compile(baseResumeTemplate)
const baseResumePostTemplate = template(templateParameters)
const baseResumeObject = JSON.parse(baseResumePostTemplate)

// Create resumes base on individual definitions
const filterResume = (resume, filters) => {
    var newResume = {...baseResumeObject}
    filters.forEach(singleFilter => newResume = singleFilter(resume))
    return newResume
}
const resumes = resumeDefinitions.map(def => ({...def,resumeJson:filterResume(baseResumeObject,def.filters)}))

// Create HTML files
resumes.forEach(resume => {
    fs.writeFileSync(`${resume.name}.json`,JSON.stringify(resume.resumeJson))
    exec(`resume export -r ${resume.name}.json -f html public/${resume.name}.html`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    fs.rmSync(`${resume.name}.json`)
})

