<?php 
/**
 * Author: Anthony Wong
 * component props
 * @param array data        fields data
 * @param array translation translation 
 * @param array config      config data
 * @param string selector   unique selector for rendering vue
 * @param string view  view to be imported
 */

// initialize
$data = isset($data) ? $data : ['no_data' => ''];
$translation = isset($translation) ? $translation : [];
$view = isset($view) ? $view : '';
$config = isset($config) ? $config : [];
if (!isset($config['customStyle'])) {
    $config['customStyle'] = ['no_style' => ''];
}
$config['langKey'] = isset($langKey) ? $langKey : 1;
$config['baseUrl'] = isset($langPath) ? $this->Html->url($langPath) : '';

/*
No idea how to use es module with async component here. Some internal module cannot resolve path correctly.
A lot of weird bugs occur.

if anyone able to do so please teach me :[
the following is a edited html helper that load esm module js, simply copy from original one:

App::uses('AppHelper', 'View/Helper');

class JSModuleHelper extends AppHelper {

	protected $_tags = array(
		'javascriptlink' => '<script type="module" src="%s"%s></script>',
	);

	protected $_includedAssets = array();

	public function script($url, $options = array()) {
		if (is_bool($options)) {
			list($inline, $options) = array($options, array());
			$options['inline'] = $inline;
		}
		$options += array('block' => null, 'inline' => true, 'once' => true);
		if (!$options['inline'] && empty($options['block'])) {
			$options['block'] = __FUNCTION__;
		}
		unset($options['inline']);

		if (is_array($url)) {
			$out = '';
			foreach ($url as $i) {
				$out .= "\n\t" . $this->script($i, $options);
			}
			if (empty($options['block'])) {
				return $out . "\n";
			}
			return null;
		}
		if ($options['once'] && isset($this->_includedAssets[__METHOD__][$url])) {
			return null;
		}
		$this->_includedAssets[__METHOD__][$url] = true;

		if (strpos($url, '//') === false) {
			$url = $this->assetUrl($url, $options + array('pathPrefix' => Configure::read('App.jsBaseUrl'), 'ext' => '.js'));
			$options = array_diff_key($options, array('fullBase' => null, 'pathPrefix' => null));

			if (Configure::read('Asset.filter.js')) {
				$url = str_replace(Configure::read('App.jsBaseUrl'), 'cjs/', $url);
			}
		}
		$attributes = $this->_parseAttributes($options, array('block', 'once'));
		$out = sprintf($this->_tags['javascriptlink'], $url, $attributes);

		if (empty($options['block'])) {
			return $out;
		}
		$this->_View->append($options['block'], $out);
	}
}

*/

if (file_exists('[your path]/manifest.json')) {
    $manifest = file_get_contents('[your path]/manifest.json'); // read the filename from manifest
    $manifest = json_decode($manifest, true);
    $filename = $manifest['src/main.ts']['file'];
    $this->Html->script('[your path]'.$filename, false);

    // // for esm module
    // $this->JSModule->script('[your path]'.$filename, false);

    // // if separate css
    // $styleName = $manifest['style.css']['file'];
    // $this->Html->css('[your path]'.$styleName, null, array('inline'=>false, 'once' => true));
}

$jsonReturnMap = [];
foreach ($translation as $key) {
    $trans = __d('some_plugin', $key);
    if ($trans == $key) {
        $trans =  __($key);
    }
    $jsonReturnMap[$key] = $trans;
}
if (count($jsonReturnMap) == 0) {
    $jsonReturnMap = [
        'no_translation_found' => 'no translation found'
    ];
}
$translation = $jsonReturnMap;

$uniqSelector = isset($selector) && !empty($selector) ? $selector : $uniqSelector = uniqid('vue-');

$initProps = [
    'data' => $data,
    'translation' => $translation,
    'config' => $config,
    'view' => $view,
    'selector' => '#'.$uniqSelector,
];


/*

to load module:
const load = window.onload;
window.onload = () => {
    load && load();
    window.initVue && window.initVue(JSON.parse('<?php echo json_encode($initProps); ?>'));
}

*/

?>

<div id="<?php echo $uniqSelector; ?>"></div>

<script>
try {
    window.initVue && window.initVue(JSON.parse('<?php echo json_encode($initProps); ?>'));
} catch (error) {
    console.warn(error);
}
</script>