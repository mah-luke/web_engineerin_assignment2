export function store(name, content) {
    localStorage.setItem(name, JSON.stringify(content));
}

export function getObject(name) {
    let tmp = localStorage.getItem(name);

    if(tmp == null || tmp == '[]' || tmp == ""){
        return null;
    } 
    else {
        return JSON.parse(tmp);
    }
}

export function getSize(name) {
    let tmp = getObject(name)
    return tmp != null? tmp.length : 0;
}