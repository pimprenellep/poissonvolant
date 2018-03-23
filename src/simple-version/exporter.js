const Exporter = {

export: function(obj) {
    for(let child of obj.children)
        this.export(child);

    if(obj.matrix == undefined || obj.geometry == undefined)
        return;

    obj.updateMatrix();
    const matrix = obj.matrix;

    const toExport = obj.geometry.clone();
    toExport.applyMatrix( matrix );

    if( toExport.vertices!==undefined && toExport.faces!==undefined ) {

        const vertices = toExport.vertices;
        const faces = toExport.faces;

        for( const k in vertices ) {
            const v = vertices[k];
            this.stringOBJ += "v "+ v.x+ " "+ v.y+ " "+ v.z+ "\n";
        }

        for( const k in faces  ) {
            const f = faces[k];

            // Les faces en OBJ sont indexés à partir de 1
            const a = f.a + 1 + this.offset;
            const b = f.b + 1 + this.offset;
            const c = f.c + 1 + this.offset;

            this.stringOBJ += "f "+ a+ " "+ b+ " "+ c+ "\n"
        }

        this.offset += vertices.length;
    }
},

exportScene: function(scene) {
    this.stringOBJ = "";
    this.offset = 0;

    for(let child of scene.children)
        this.export(child);


    this.download( this.stringOBJ, "fish.obj" );
},

download: function(text, name) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
},
}