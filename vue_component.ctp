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

the following class is a edited html helper that load esm module js, simply copy from original one:

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

// change to other format, e.g. esm, for other build format
// available: esm | umd
$format = 'esm';
// modify all path by yourself
$rootPath = "../Plugin/[plugin name]/webroot/vuejs/$format/manifest.json";

if (file_exists($rootPath)) {
	// read the filename from manifest
    $manifest = file_get_contents($rootPath);
    $manifest = json_decode($manifest, true);
    $filename = $manifest["src/main_$format.ts"]["file"];

	if ($format == 'umd') {
		// for umd
    	$this->Html->script('/[plugin name]/vuejs/'.$format.'/'.$filename, false);
	}

	if ($format == 'esm') {
		// for esm module (still under development)
		$this->JSModule->script("/[plugin name]/vuejs/$format/$filename", false);
	}

	if (isset($manifest['style.css'])) {
		// if separate css
		$styleName = $manifest['style.css']['file'];
		$this->Html->css("/[plugin name]/vuejs/$format/$styleName", null, array('inline'=>false, 'once' => true));
	}
}

$jsonReturnMap = [];
foreach ($translation as $key) {
    $trans = __d('[plugin name]', $key);
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

?>

<div id="<?php echo $uniqSelector; ?>"></div>

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
