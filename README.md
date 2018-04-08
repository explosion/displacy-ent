<a href="https://explosion.ai"><img src="https://explosion.ai/assets/img/logo.svg" width="125" height="125" align="right" /></a>

# displaCy ENT: A modern named entity visualiser

> ⚠️ **As of v2.0.0, the displaCy visualizers are now integrated into
> the core library. [See here](https://spacy.io/usage/visualizers) for more 
> details on how to visualize a `Doc` object from within spaCy. We're also
> working on a new suite of tools for serving and testing spaCy models. The
> code of the standalone visualizers will still be available on GitHub, just
> not actively maintained.**

Data exploration is an important part of effective named entity recognition because systems often make common unexpected errors that are easily fixed once identified. Despite the apparent simplicity of the task, automatic named entity recognition systems still make many errors, unless trained on examples closely tailored to the use-case. Check out the [demo](https://demos.explosion.ai/displacy-ent) to visualise [spaCy](https://spacy.io)'s guess at the named entities in the document. You can filter the displayed types, to only show the annotations you're interested in.

To read more about displaCy-ent.js, check out the [blog post](https://explosion.ai/blog/displacy-ent-named-entity-visualizer).

[![npm](https://img.shields.io/npm/v/displacy-ent.svg)](https://www.npmjs.com/package/displacy-ent)

## Run the demo

This demo is implemented in [Jade (aka Pug)](https://www.jade-lang.org), an extensible templating language that compiles to HTML, and is built or served by [Harp](https://harpjs.com). To serve it locally on [http://localhost:9000](http://localhost:9000), simply run:

```bash
sudo npm install --global harp
git clone https://github.com/explosion/displacy-ent
cd displacy-ent
harp server
```

The demo is written in ECMAScript 6. For full, cross-browser compatibility, make sure to use a compiler like [Babel](https://github.com/babel/babel). For more info, see this [compatibility table](https://kangax.github.io/compat-table/es6/).

## Using displacy-ent.js

To use displaCy ENT in your project, include [`displacy-ent.js`](assets/js/displacy-ent.js) from GitHub or via npm:

```bash
npm install displacy-ent
```

Then initialize a new instance specifying the API and settings:

```javascript
const displacy = new displaCyENT('http://localhost:8000', {
    container: '#displacy',
    defaultText: 'When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously.',
    defaultEnts: ['person', 'org', 'date']
});
```

Our service that produces the input data is open source, too. You can find it at [spacy-services](https://github.com/explosion/spacy-services).

The following settings are available:

| Setting | Description | Default |
| --- | --- | --- |
| **container** | element to display text in, can be any query selector | `#displacy` |
| **defaultText** | text used if displaCy ENT is run without text specified | `'When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously.'` |
| **defaultModel** | model used if displaCy ENT is run without model specified | `'en'` |
| **defaultEnts** | array of entities highlighted in text | `['person', 'org', 'gpe', 'loc', 'product']` |
| **onStart** | function to be executed on start of server request | `false` |
| **onSuccess** | callback function to be executed on successful server response | `false` |
| **onRender** | callback function to be executed when visualisation has rendered | `false` |
| **onError** | function to be executed if request fails | `false` |

## Visualising Entities

The `parse(text, model, ents)` method renders a text for a given set of entities in the container.

```javascript
const text = 'When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously.';
const model = 'en';
const ents = ['person', 'org', 'date'];

displacy.parse(text, model, ents);
```

## Rendering Entities Manually

Alternatively, you can use `render()` to manually render a text and its entity spans for a given set of entities:

```javascript
const text = 'When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously.';
const spans = [ { end: 20, start: 5, type: "PERSON" }, { end: 67, start: 61, type: "ORG" }, { end: 75, start: 71, type: "DATE" } ];
const ents = ['person', 'org', 'gpe', 'loc', 'product'];

displacy.render(text, spans, ents);
```
## How it works

displaCy ENT uses only the `<mark>` element with data attributes and custom CSS styling. No additional, visible content or markup is added to your input text and no JavaScript is required to display the entities.

Here's an example of the markup:

```html
<div class="entities">
    When <mark data-entity="person">Sebastian Thrun</mark> started working on self-driving cars at
    <mark data-entity="org">Google</mark> in <mark data-entity="date">2007</mark>, few people outside of the
    company took him seriously.
</div>
```

And here is the CSS it needs to display the entity labels:

```css
.entities {
    line-height: 2;
}

[data-entity] {
    padding: 0.25em 0.35em;
     margin: 0px 0.25em;
     line-height: 1;
     display: inline-block;
     border-radius: 0.25em;
     border: 1px solid;
}

[data-entity]::after {
    box-sizing: border-box;
    content: attr(data-entity);
    font-size: 0.6em;
    line-height: 1;
    padding: 0.35em;
    border-radius: 0.35em;
    text-transform: uppercase;
    display: inline-block;
    vertical-align: middle;
    margin: 0px 0px 0.1rem 0.5rem;
}

[data-entity][data-entity="person"] {
    background: rgba(166, 226, 45, 0.2);
    border-color: rgb(166, 226, 45);
}

[data-entity][data-entity="person"]::after {
    background: rgb(166, 226, 45);
}

[data-entity][data-entity="org"] {
    background: rgba(67, 198, 252, 0.2);
    border-color: rgb(67, 198, 252);
}

[data-entity][data-entity="org"]::after {
    background: rgb(67, 198, 252);
}

[data-entity][data-entity="date"] {
    background: rgba(47, 187, 171, 0.2);
    border-color: rgb(47, 187, 171);
}

[data-entity][data-entity="date"]::after {
    background: rgb(47, 187, 171);
}
```

Entity labels are taken from the `data-entity` attribute and are rendered after the span as a CSS pseudo element.
