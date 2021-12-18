# Sam's JSON Resume

This project stores my resume under source control and has some added features for resume manipulation. All experiences are added to [resume-base.json](resume-base.json). Resumes are built as html files using [build-resumes.js](build-resumes.js).

# Local development

```
docker-compose up -d
docker exec -it json-resume_node_1 sh
cd code
npm install
node build-resumes.js
node view-resumes.js
```