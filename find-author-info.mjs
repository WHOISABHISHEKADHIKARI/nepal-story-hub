async function findAuthorProjectInfo() {
    const res = await fetch('http://localhost:3000/api/authors');
    const data = await res.json();
    const targetAuthors = data.data.filter(a => a.project === 18 || a.project === 46);
    console.log("Authors in projects 18 or 46:", JSON.stringify(targetAuthors, null, 2));
}
findAuthorProjectInfo();
