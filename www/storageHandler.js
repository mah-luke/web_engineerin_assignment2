function store(name, content) {
    localStorage.setItem(name, JSON.stringify(content));
}

function get(name) {
    tmp = localStorage.getItem(name)

    if(tmp == null || tmp == '[]'){
        return null;
    } else {
        return JSON.parse(tmp);
    }
}