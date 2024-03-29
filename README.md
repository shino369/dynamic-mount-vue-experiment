# Guide To Use Vue.js in Current CakePHP project
### vue version @3.2.45

This project is aim to `dynamically mounting vue.js view/component to anywhere` in the php generated HTML tempalte by simply inserting a `.ctp` component as entry point. As there is only minimal configuration in PHP side, you can use it in other kind of server side old project.

This project use:
- Vue.js 3.2 (Composition API)
- Vue SFC (Single File Component)
- TypeScript
- Tailwind CSS
- Vite + Rollup

To enforce code style and reduce error, project is configured with ESlint and Prettier.


<br>

### Recommended VScode Extensions
- ESlint
- Prettier
- TypeScript Vue Plugin (Volar)
- Vue Language Features (Volar)
- Tailwind CSS IntelliSense
- JavaScript (ES6) code snippets

<br>

## To Start with
To start, run `npm i` / `yarn` to install required depenencies.To start development, run `npm run dev` / `yarn dev`. It will start the rollup file-watching function and rebuild the project on save. You can also manually build by `npm run build` / `yarn build`. The javascript source will be bundled into a single `main_umd-[hash].js` if using umd build, and scoped css will also be bundled into the file. Esm build is still under testing, not recommend to use it.

The created minified js file will be located in your webroot path automatically.

To change build format `(umd/esm)`, config the variable `VITE_FORMAT` in .env. For esm build, asset path if neccessary. Config  `VITE_BASE` in .env to change it to your server base url.

<br>

---

<br>

## Entry Point
To use vue.js in the project, you have to use ctp file to serve as an entry point for receiving props. Call this in your view file:


```php
echo $this->element('vue_component',[
    'view' => 'viewName',
    // data to be pass as props
    'data' => $data,
    // pass necessary translation
    'translation' => [
        'some_translate'    // only need key
    ],
    'config' => [
        'baseUrl' => $this->HTML->url($langPath),
        'langKey' => $langKey,
        'customStyle' => $customStyle,
    ],
    
    //not necessary. will random generate a unique selector if not provided.
    'selector' => $someUniqueSelector, 
]);
```

The `vue_component.ctp` will include essential file
- `Tms/webroot/js/vuejs/[format]/asset/main_[format]-[hash].js` 
- `Tms/webroot/js/vuejs/[format]/asset/style.css` (if using esm format)
- `Tms/webroot/js/vuejs/[format]/manifest.json` 

Files will be genereated automatically on save.\
The hash name can be got by reading `manifest.json`.

```php
// change to other format, e.g. esm, for other build format.
// available: esm | umd
$format = 'esm';
$rootPath = "../Plugin/Tms/webroot/vuejs/$format/manifest.json";

if (file_exists($rootPath)) {
	// read the filename from manifest
    $manifest = file_get_contents($rootPath);
    $manifest = json_decode($manifest, true);
    $filename = $manifest["src/main_$format.ts"]["file"];

	if ($format == 'umd') {
		// for umd
    	$this->Html->script('/tms/vuejs/'.$format.'/'.$filename, false);
	}

	if ($format == 'esm') {
		// for esm module (still under development)
		$this->JSModule->script("/tms/vuejs/$format/$filename", false);
	}

	if (isset($manifest['style.css'])) {
		// if separate css
		$styleName = $manifest['style.css']['file'];
		$this->Html->css("/tms/vuejs/$format/$styleName", null, array('inline'=>false, 'once' => true));
	}
}
```

After adding essential files to html head, The `vue_component.ctp` will assign the necessary props passed by server to a function called `initVue` (if umd) or push to `initVue` as window var, and start mouting the vue.js view.

```php
$initProps = [
    'data' => $data,
    'translation' => $translation,
    'config' => $config,
    'view' => $view,
    'selector' => '#'.$uniqSelector,
];
```

```html

<div id="<?php echo $uniqSelector.'_script'; ?>">
<script>
try {
	const format = '<?php echo $format; ?>';
	const props = JSON.parse('<?php echo json_encode($initProps); ?>');
	switch (format) {
		case 'umd':
			window.initVue && window.initVue(props);
			break;
		case 'esm':
			window.initVue = window.initVue || [];
			window.initVue.push(props);
			break;
	}

	// remove this script block after props loaded
	document.querySelector(props.selector + '_script').remove()

} catch (error) {
    console.warn(error);
}
</script>
</div>

```

<br>

---

<br>

## Vue.js

### Example of a Vue.js SFC File
The project will use vue SFC (Single File Component). SFC is file with `.vue` extension.\
Please use camel-case to name view and component. For better define, name your view file with postfix/suffix `View` :\
e.g. `SomethingView.vue`



```ts
// ExampleView.vue
<script setup lang="ts">
import { ref } from 'vue'
import IconButton from '@/components/icons/Icon-plus.vue'

//  Type for Props must be declared inside SFC.
//  Other types like ref<SomeType>() can use import
interface Props {
    name: string
    enable: boolean
}

const props = defineProps<Props>()
const count = ref<number>(0)

const increment = () => {
    props.enable && count.value++
}
</script>
<template>
    <div class="wrapper">
        {{ count }}
        <button class="max-h-10 max-w-10" type="button" @click="increment">
            click me!
        </button>
        <IconButton :name="name" iconClassName="w-6 h-6 " />
    </div>
</template>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
}
</style>


```

<br>


### Commonly Used Vue Function (Composition API)
For more detail please see [official document](https://vuejs.org/guide/introduction.html)\
script:
```ts
import {ref, computed, onMounted, watch } from 'vue'
/**
 * ref()
 * use for reactive state
 * reactive state is needed for template html to rerender
 * type can be automatically referenced by initial value
 * or added like ref<number>(0)
 * generally ES6 proxy value
 * inside <script> tag you need to acess by count.value
 * inside <tempalte> tag you can acess directly by count
 */
const count = ref(0)
const count2 = ref(-1)
// count === 0
count.value ++
// count === 1
count.value += count2.value
// count === 0


/**
 * computed(()=>val)
 * use for non-reactive variable (not using ref)
 * can compute a reactive variable by non-reactive variable
 * or reutrn some combined result
 */
let tempStr = ''                            // can no trigger rerender in <template>
const compTemp = computed(() => tempStr)    // can trigger rerender in <template>
const compCount = computed(() => count.value + count2.value)

/**
 * onMounted(()=> {})
 * just like the react's componentDidMount
 */
onMounted(() => {
    console.log('hello world!')
})

/**
 * watch(()=> val,
 * (newVal, oldVal) => {
 *  // dp something
 * }, {
 *  // extra options
 * })
 */

watch(
    () => count.value,
    (newVal, _oldVal) => {
        console.log(newVal)
    },
    {
        deep: true  // use to deeply watch nested proxy
    }
)

```
template:
```html
    <!-- [v-for] attribute, use for array looping -->
    <div v-for="(num, index) in [1,2,3,4,5]" :key="num">
        {{num}}
    <div>

    <!-- [v-if] attribute, will show the element if value is true -->
    <div v-if="show">showing</div>

    <!-- [@] event listener, and concat with .stop (stop propragation), .prevent (prevent default) -->
    <button @click.stop.prevent="someFunction">click me</button>

    <!-- [:+ traditional attr] can use variable / function determine -->
    <div 
        class="test" 
        :class="{
            'test-2': a > b
        }"
        :style="{
            marginRight: a > b ? '1rem' : '2rem'
        }"
    ></div>
    <div :class="`${a > b ? 'test-1' : 'test2'}`"></div>

    <!-- component reveive props -->
    <CompoentA :propsA="thisIsAVar" />
    <CompoentB propsA="this is a string" />

    <!--slot, see: https://vuejs.org/guide/components/slots.html#named-slots -->
    <!-- component A -->
    <div>
        <slot></slot>
    </div>

    <ComponentA>
        <div>content for slot</div>
    </ComponentA>
```

### Tailwind CSS
syntax is similar to bootstrap, but with enhanced power of `Arbitrary values` and other features.\
see width as an example.
```html
<div class="w-[32rem]">
  <!-- ... -->
</div>
```
For more detail see [official document](https://tailwindcss.com/docs)
