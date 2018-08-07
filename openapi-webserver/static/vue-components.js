'use strict';

function generateExampleObject(schema) {

    if (_(schema).has('properties')) {
        // Create each of the documented properties, and generate an example of it
        return _(schema.properties).mapObject(generateExampleObject);
    }

    if (_(schema).has('example')) {
        // Return the example value that was defined in the document.
        return schema.example;
    }

    switch (schema.type) {
        case "string": return "string";
        case "integer": return 1;
        case "number": return 1.0;
        case "boolean": return true;
        case "object":
            // Create each of the documented properties, and generate an example of it
            return _(schema.properties).mapObject(generateExampleObject);
        case "array":
            const singleObject = generateExampleObject(schema.items);
            return [singleObject];
        default:
            return `<<<${schema.type}>>>`;
    }
}

Vue.component('openapi-spec', {
    props: ['spec'],
    template: `
<div class="specification">
    <openapi-path 
        v-for="(pathItem, path) in spec.paths" 
        v-bind:path="path"  
        v-bind:pathItem="pathItem"
        ></openapi-path></div>
`,
});

Vue.component('openapi-path', {
    props: ['path', 'pathItem'],
    computed: {
        methods: function() {
            return _(this.pathItem).pick('get', 'post', 'put', 'delete', 'patch')
        }
    },
    template: `
<div class="path">
    <h1>{{path}}</h1>
    <openapi-path-item 
        v-for="(operation, method) in methods" 
        v-bind:method="method" 
        v-bind:operation="operation"
        v-bind:pathParameters="pathItem.parameters"
        ></openapi-path-item>
</div>
`,
});

Vue.component('openapi-path-item', {
    props: ['method', 'operation', 'pathParameters'],
    computed: {
        methodClass: function() {
            return `method-${this.method}`;
        }
    },
    template: `
<div class="path-item" v-bind:class="methodClass">
    <header><h2>{{method}}</h2><span class="summary">{{operation.summary}}</span></header>
    <openapi-operation 
        v-bind:operation="operation"
        v-bind:pathParameters="pathParameters"
        ></openapi-operation>
</header>`
});

Vue.component('openapi-operation', {
    props: ['operation', 'pathParameters'],
    computed: {
        allParameters: function() {
            const result = _.union(this.pathParameters, this.operation.parameters);
            return (result.length > 0 ? result : null);
        }
    },
    template: `
<div class="operation">
    <table v-if="allParameters">
        <thead>
            <tr>
                <th>Parameter</th>
                <th>in</th>
                <th>type</th>
                <th>description</th>
                <th>required</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="parameter in allParameters">
                <td>{{parameter.name}}</td>
                <td>{{parameter.in}}</td>
                <td>{{parameter.schema.type}}</td>
                <td>{{parameter.description}}</td>
                <td>{{parameter.required}}</td>
            </tr>
        </tbody>
    </table>
    
    <openapi-request-body
        v-bind:requestBody="operation.requestBody"
        ></openapi-request-body>
    
    <openapi-response 
        v-for="(response, statusCode) in operation.responses" 
        v-bind:statusCode="statusCode" 
        v-bind:response="response"
        ></openapi-response>
</div>
`
});

Vue.component('openapi-request-body', {
    props: ['requestBody'],
    template: `
<div class="request">
    <openapi-response-content 
        v-for="(content, type) in requestBody.content"
        v-bind:contentType="type"
        v-bind:content="content"
        ></openapi-response-content>
</div>
`
});

Vue.component('openapi-response', {
    props: ['statusCode', 'response'],
    template: `
<div class="response">
    <header><h2>{{statusCode}}</h2></header>
    <p class="description">{{response.description}}</p>
    <table v-if="response.headers">
        <thead>
            <tr>
                <th>Header</th>
                <th>type</th>
                <th>description</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(headerContent, name) in response.headers">
                <td>{{name}}</td>
                <td>{{headerContent.schema.type}}</td>
                <td>{{headerContent.description}}</td>
            </tr>
        </tbody>
    </table>

    <openapi-response-content v-for="(content, type) in response.content"
        v-bind:contentType="type"
        v-bind:content="content"
        ></openapi-response-content>
</div>
`
});

Vue.component('openapi-response-content', {
    props: ['contentType', 'content'],
    computed: {
        exampleObject: function() {
            const obj = generateExampleObject(this.content.schema);
            const stringify = JSON.stringify(obj, null, 2);
            return stringify;
        }
    },
    template: `
<div class="response-content">
    <p><strong>{{contentType}}</strong></p>
    <div class="code-wrapper">
        <pre><code>{{exampleObject}}</code></pre>
    </div>
</div>
`
});