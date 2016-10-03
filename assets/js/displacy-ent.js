//- ----------------------------------
//- 💥 DISPLACY ENT
//- ----------------------------------

'use strict';

class displaCyENT {
    constructor (api, options) {
        this.api = api;
        this.container = document.querySelector(options.container || '#displacy');

        this.defaultText = options.defaultText || 'When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously.';
        this.defaultModel = options.defaultModel || 'en';
        this.defaultEnts = options.defaultEnts || ['person', 'org', 'gpe', 'loc', 'product'];

        this.onStart = options.onStart || false;
        this.onSuccess = options.onSuccess || false;
        this.onError = options.onError || false;
        this.onRender = options.onRender || false;

    }

    parse(text = this.defaultText, model = this.defaultModel, ents = []) {
        if(typeof this.onStart === 'function') this.onStart();

        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.api, true);
        xhr.setRequestHeader('Content-type', 'text/plain');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                if(typeof this.onSuccess === 'function') this.onSuccess();
                this.render(text, JSON.parse(xhr.responseText), ents);
            }

            else if(xhr.status !== 200) {
                if(typeof this.onError === 'function') this.onError(xhr.statusText);
            }
        }

        xhr.onerror = () => {
            xhr.abort();
            if(typeof this.onError === 'function') this.onError();
        }

        xhr.send(JSON.stringify({ text, model }));
    }

    render(text, spans, ents) {
        let offset = 0;
        let fragments = [];

        spans.forEach(({ type, start, end }) => {
            fragments.push(
                text.slice(offset, start),
                (ents.includes(type.toLowerCase())) ? `<mark data-entity="${type.toLowerCase()}">${text.slice(start, end)}</mark>` : text.slice(start, end)
            );
            offset = end;
        });

        fragments.push(text.slice(offset, text.length));
        this.container.innerHTML = fragments.join('').replace(/\n/g, '<br />');
        if(typeof this.onRender === 'function') this.onRender();
    }
}
