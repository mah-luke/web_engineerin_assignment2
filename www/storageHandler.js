function store(name, content) {
    localStorage.setItem(name, JSON.stringify(content));
}

function getObject(name) {
    tmp = localStorage.getItem(name);

    if(tmp == null || tmp == '[]' || tmp == ""){
        return null;
    } 
    else {
        return JSON.parse(tmp);
    }
}

function getSize(name) {
    tmp = getObject(name)
    return tmp != null? tmp.length : 0;
}