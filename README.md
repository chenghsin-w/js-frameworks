# JS Frameworks

### Why use a JS framework?

 * Write less code
 * Make code base easier to maintain
 * Promote code reuse

### Which framework?

Picking up a right JavaScript framework for a new/existing project is probably not an easy job since there are tons of frameworks available. From years of experience on working with JavaScript, I would suggest look from these directions for evaluating a framework:

 * What's the learning curve for your team to adopt
 * If it's for an existing project, how much effort is required to refactor your code base
 * What type of web services payload you need to deal with
 * How big is the online community of the framework
 * What are the feature sets of your end product, and if the framework can help you build them easily

Most important, don't make a decision without really trying the framework out.

In this demo, there are 3 popular JS frameworks used to build a simple Todo application. The UI and features are the same for each framework. In the application, you can add, update, and delete tasks from your todo list (CRUD operations) and persist to backend via AJAX. Hope by playing around the demo and reading through the comments in the source code can help you determine what framework is better for your project.

### Frameworks in this demo

 * [AngularJS](https://angularjs.org/) (1.x)
 * [React](https://facebook.github.io/react/)
 * [Vue](https://vuejs.org/)

[Angular](https://angular.io/) (4.x) was not picked since it uses TypeScript, and it would take more time and steps to set up the compile process for the demo. It might get added to the list in the future.

### Demo source code path

 `/app/public/javascripts/[framework]`

Each framework has a main.js(x) file in which you can see one main component/module defined for the main UI and one task component defined for each task in the todo list. Templates are embedded in the index.html for Vue and AngularJS. For React, template is directly embedded with each component.

### Run the demo

The steps are based on using Docker node-mysql container. With the container, you don't need to install Node and MySQL and can skip a lot of configuration.

 1. Install [Docker Community Edition](https://www.docker.com/community-edition)

 2. Clone this repository to your local
    ```bash
    git clone https://github.com/zero-gap/js-frameworks.git
    ```
    Or download the zip file of the repository directly from the GitHub page and extract it

 3. Use Docker CLI to create a [zerogap/node-mysql](https://hub.docker.com/r/zerogap/node-mysql/) container for the demo (replace `$PATH_TO_PROJECT` with the absolute path of the project folder)
    ```bash
    docker run --name node-mysql -v $PATH_TO_PROJECT/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d -v $PATH_TO_PROJECT/app:/home/node/app -p 3000:3000 -e MYSQL_ROOT_PASSWORD=my-secret-pw -d zerogap/node-mysql
    ```
    Note: for Windows, the `$PATH_TO_PROJECT/` should be `$PATH_TO_PROJECT\`

 4. Install dependencies for the demo
    ```bash
    docker exec -it node-mysql bash -c "cd /home/node/app && npm install"
    ```

 5. Run the application inside the container
    ```bash
    docker exec -it node-mysql bash -c "cd /home/node/app && npm start"
    ```

 6. Visit http://localhost:3000/ with your modern browser

 ### Takeaways

 <table>
   <thead>
     <tr>
       <th></th>
       <th>AngularJS</th>
       <th>React</th>
       <th>Vue</th>
     </tr>
   </thead>
   <tbody>
     <tr>
       <td>Auto data binding</td>
       <td>Two-way</td>
       <td>One-way (unidirectional data flow)</td>
       <td>Two-way</td>
     </tr>
     <tr>
       <td>Data change watcher</td>
       <td>Only available in <a href="https://docs.angularjs.org/guide/module">module</a> not <a href="https://docs.angularjs.org/guide/component">component</a></td>
       <td>No</td>
       <td>Yes</td>
     </tr>
     <tr>
       <td>DOM event binding</td>
       <td>Yes</td>
       <td>Yes</td>
       <td>Yes</td>
     </tr>
     <tr>
       <td>Event binding between components</td>
       <td>Yes</td>
       <td>Yes</td>
       <td>Yes</td>
     </tr>
     <tr>
       <td>Simple syntax for DOM manipulation</td>
       <td>Yes</td>
       <td>Yes</td>
       <td>Yes</td>
     </tr>
     <tr>
       <td>AJAX utils</td>
       <td>Yes</td>
       <td>No</td>
       <td>No</td>
     </tr>
     <tr>
       <td>Others</td>
       <td valign="top">
         <ul>
           <li>Hard to do component-based architecture since components have to be created under a module</li>
           <li>Scope in templates and controllers works differently between modules and components</li>
         </ul>
       </td>
       <td valign="top">
         <ul>
           <li>Due to the unidirectional data flow design, data and event binding is very tedious (especially after v15 the two-way binding API <a href="https://facebook.github.io/react/docs/two-way-binding-helpers.html">LinkedStateMixin</a> is deprecated)</li>
           <li>JSX compilation is required</li>
         </ul>
       </td>
       <td valign="top">
         <ul>
           <li>Less functionalities but lightweight</li>
         </ul>
       </td>
     </tr>
   </tbody>
 </table>
