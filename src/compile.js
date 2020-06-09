const fs = require('fs');
const path = require('path');

const template = (title, content) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>${title != null ? `${title} – ` : ''}Jean's notes</title>
    <meta name="author" content="Jean Lauliac">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

    <!-- GENERATED FILE, DO NOT EDIT MANUALLY -->
</head>

<body>
${content}
</body>

</html>
`;

const home_template = (articles) => `
<header>
    Hi! I'm <a href="https://www.twitter.com/jeanlauliac">Jean</a>. I'm a software engineer working at
    <a href="https://www.theguardian.com/uk">The&nbsp;Guardian</a> and here is
    where I'll be keeping some notes and side projects.
</header>

<main>
    ${articles}
</main>

<footer>
    <ul id="social_links">
        <li><a href="https://mobile.twitter.com/jeanlauliac">twitter</a></li>
        <li><a href="https://github.com/jeanlauliac">github</a></li>
    </ul>
</footer>
`;

const article_template = (metadata, intro, content) => `
<article>

<span class="kicker">${metadata.kicker}</span>
<h1>${metadata.title}</h1>
${intro}

${content}

</article>
`;

const articles_path = 'src/articles';
const metadata_regex = /^<!--({[\s\S]+})-->/;
const time_options = {
    dateStyle: "long",
};

function main() {
    const article_names = fs.readdirSync(articles_path);
    const articles = [];
    
    for (const article_name of article_names) {
        const content = fs.readFileSync(path.join(articles_path, article_name), 'utf8');
        const metadata_json = metadata_regex.exec(content);
        if (metadata_json == null) {
            throw new Error(`didn't found metadata for ${article_name}`);
        }

        const metadata = JSON.parse(metadata_json[1]);
        const html = content.substr(metadata_json[0].length);
        const intro = `
        <p><time datetime="${metadata.time}">
            ${new Intl.DateTimeFormat('en-GB', time_options).format(new Date(metadata.time))}
        </time> ${metadata.intro}</p>
        `;

        articles.push(`
        <article>
            <span class="kicker">${metadata.kicker}</span>
            <h3><a href="${article_name}">${metadata.title}</a></h3>
            ${intro}
        </article>
        `);
        fs.writeFileSync(article_name, template(article_name, article_template(metadata, intro, html)));
    }
    fs.writeFileSync('index.html', template(null, home_template(articles.join('\n'))));
}

main();
