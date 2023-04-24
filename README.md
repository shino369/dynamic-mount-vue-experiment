# Guide To Use Vue.js in Currently CakePHP project (TMS Module Only)
### vue version @3.2.36
vue@3.2.36\
minified
https://unpkg.com/vue@3.2.36/dist/vue.global.prod.js

dev with comment
https://unpkg.com/vue@3.2.36/dist/vue.global.js

official site
https://vuejs.org/guide/quick-start.html

To enforce code style and reduce error, project is configured with ESlint and Prettier by setting up a node project.\
Please run `npm i` or `yarn` and install corresponding module, and install the above VScode extension.\
To start development, run `npm run dev` or `yarn dev`. It will create minified js file and copy to the webroot path automatically on file change. Run `npm run build` or `yarn build` for building only.

<br>

---

<br>

## Entry Point
To use vue.js in the project, you must use ctp file to serve as an entry point for receiving props. Call this in your view file:


```php
echo $this->element('vue_component',[
    // data to be pass as props
    'data' => $data,
    // pass necessary translation
    'translation' => [
        'some_translate' => __d('tms', 'some_translate')
    ],
    //not necessary. will random generate a unique selector if not provided.
    'selector' => $someUniqueSelector, 
    'components' => [
        // include one (and only one) view file in the pattern of [filename]View to serve as entry point
        'someView'
    ],
]);
```

All view and component files are located inside `Tms/Vuejs/src/`.
- `components` should be put to `Tms/Vuejs/src/components/`
- `views` should be put to `Tms/Vuejs/src/views/`

In case of any error, chnage to use manual hardcode for mapping.

The `vue_component.ctp` is predefined to include essential files
- `Tms/webroot/js/vuejs/vue.global.prod.js` 
- `Tms/webroot/js/vuejs/src/component.js`

The `component.js` is a single file of the compiled version of your components. It will be genereated automatically.

```php
$essentials = [
    /*'Vue' =>*/ '/tms/js/vuejs/vue.global.prod.js',
    /* 'component' =>*/ '/tms/js/vuejs/src/component.js'
];
```

After adding essential files to html head (once), The `vue_component.ctp` will add the components/views you stated to html head (once). It will then assign the necessary props passed by server to `commonUtils.setProps()`, and call the `Tms/webroot/js/vuejs/src/entry.js`  in inline script.

```js
  // this will be called and add props to window, and will delete after component mounted
  window.commonUtils && window.commonUtils.setProps({
    data: JSON.parse('<?php echo json_encode($data); ?>'),
    translation: JSON.parse('<?php echo json_encode($translation); ?>'),
    components: JSON.parse('<?php echo json_encode($components); ?>'),
    uniqSelector: '#<?php echo $uniqSelector; ?>'
  });
```

The `Tms/webroot/js/vuejs/src/entry.js` will read the props and initialize `vue.js`.

<br>

---

<br>

## Example of a Vue Component

```js
// eslint-disable-next-line no-unused-vars
(function () {  // must use a unique name to declare in global
    'use strict';
    // global var
    const { Vue, commonUtils } = window;
    
    if (!Vue || !commonUtils) {
        throw new Error(`Vue.js and commonUtils.js not initialized.`);
    }

    // template. the html comment use "es6-string-html" extemsion to style html str
    const templateStr = /*html*/ `
    <div>
        <button type="button" @click="countOnClick" > {{count}} </button>
        <SomeComponent :propsToBePass="count" >
            <!-- child -->
        </SomeComponent>
    </div>
  `;

    // script
    const ComponentA = () => ({
        template: templateStr,
        props: {
            someProps: Object,
            someFunc: Function
        },
         components: {
            ...commonUtils.registerComponent(['SomeComponent']),
        },
        setup(props) {
            const { ref, onMounted, computed } = Vue;
            const count = ref(0);

            const countOnClick = () => {
                count.value ++;
                props.someFunc();
            }

            onMounted(() => {
                console.log('component mounted!');
            });

            return { count };
        },
    });

    // this is used to mount component
    commonUtils.mount('ComponentA', {
        ComponentA,
    });
})();


```

<br>

---

<br>

## Future Development
In general cases, using `type="module"` will be easier to handle:
```html
<script type="module">
    import { componentA } from '../paths/ComponentA.js'
</script>
```
But does not like normal npm module which will compiled by directly import module file will have cache issue, you need to add version number to the end, like `../paths/ComponentA.js?v=12345` to get updated version. And it is quite dumb to add a timestamp manually. 

```php
    /* 
        FOR FUTURE USAGE (?)
        type=module are supported since 2017. We can use module to ensure scope separation for each code block
        but the server genereally configured to refer to a cached file forever if not adding a timestamp or version for the file
        
        this will work, but dumb as fk:
        <script type="module">
        import { createApp } from '<?php echo $this->webroot.'/js/vuejs/vue.esm-browser.prod.js?'.(floor(microtime(true) / 10) * 10);?>'
        import { ExtraPreference } from '<?php echo $this->webroot.'/js/vuejs/components/extraPreference/ExtraPreference-esm.js?'.(floor(microtime(true) / 10) * 10); ?>'
        ...
        </script>
        
        it can solve by using cdn serve directly 
        or can use importmap to define the timestamp at once, but the browser support is still poor (see import_vue.ctp)
        Define import mapping. After that you can directly import it from ctp, e.g.
        in ctp view, call this on top:
        include once in parent file only!!
        echo $this->element('import_vue', [
            'modules' => ['vue', 'utils'],
            'components' => ['ExtraPreference']
        ]);
        then you can use 'import' statement:
        <script type="module">  // type must be module
            import { ref, createApp } from 'vue'
            import { pipe } from 'utils'
            import { ComponentA } from 'ComponentA'
            createApp({
                tempalte: `
                    <ComponentA />
                `,
                components: {
                    ComponentA
                },
                setup() {
                    const count = ref(0)
                    const increment = (e) => {
                        count.value++
                        console.log(count.value)
                    }
                    return {
                        count, 
                        increment,
                    }
                }
            }).mount('#vue-app')
        </script>
    */
    /*
        $functionMapping = [
            'vue' => $this->webroot.'/js/vuejs/vue.esm-browser.prod.js',
            'utils' => $this->webroot.'/js/utils/commonUtils-esm.js',
        ];
        $componentMapping = [
            'ExtraPreference' => $this->webroot.'/js/vuejs/components/extraPreference/ExtraPreference-esm.js'
        ];
        $mapArr = [];
        if (isset($modules)){
            foreach ($modules as $module) {
                if (!empty($functionMapping[$module])) {
                    $mapArr[$module] = $functionMapping[$module];
                }
            }
        }
        if (isset($components)) {
            foreach ($components as $component) {
                if (!empty($componentMapping[$component])) {
                    $mapArr[$component] = $componentMapping[$component].'?'.floor(microtime(true) * 1000);
                }
            }
        }
        // safari support from version 16.4 (March, 2023), shall not use import map for now 
        // wait until IOS 17 or 18 release
        $support = false;
        if(count($mapArr) > 0 && $support) {
            $moduleMap = $this->Html->tag(
                'script',
                json_encode([
                    "imports" => $mapArr
                ]),
                [	
                    'type' => 'importmap',
                    'inline' => false,
                    'once' => false
                ]
            );
            $this->append('script',  $moduleMap);
        }
    */
```
