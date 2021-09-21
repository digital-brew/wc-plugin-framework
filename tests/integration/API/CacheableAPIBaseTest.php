<?php

use SkyVerge\WooCommerce\PluginFramework\v5_10_10 as Framework;
use SkyVerge\WooCommerce\PluginFramework\v5_10_10\SV_WC_API_JSON_Request;
use SkyVerge\WooCommerce\PluginFramework\v5_10_10\API\Abstract_Cacheable_API_Base;
use SkyVerge\WooCommerce\PluginFramework\v5_10_10\API\Traits\Cacheable_Request_Trait;
use SkyVerge\WooCommerce\PluginFramework\v5_10_10\SV_WC_API_Request;

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', true );
}

class CacheableAPIBaseTest extends \Codeception\TestCase\WPTestCase {


	/**
	 * Tests {@see Framework\API\Abstract_Cacheable_API_Base::format_percentage()}.
	 *
	 * @dataProvider provider_is_request_cacheable
	 *
	 * @param bool $cacheable whether to test with a cacheable request
	 * @param null|bool $filter_value when provided, will filter is_cacheable with the given value
	 * @param bool $expected expected return value
	 * @throws ReflectionException
	 */
	public function test_is_request_cacheable( bool $cacheable, $filter_value = null, bool $expected )
	{
		$api = $this->get_new_api_instance();

		$property = new ReflectionProperty( get_class( $api ), 'request' );
		$property->setAccessible( true );
		$property->setValue( $api, $this->get_new_request_instance( $cacheable ) );

		if ( is_bool( $filter_value ) ) {
			add_filter(
				'wc_plugin_' . sv_wc_test_plugin()->get_id() . '_api_request_is_cacheable',
				// the typehints in the closure ensure we're passing the correct arguments to the filter from `is_request_cacheable`
				static function( bool $is_cacheable, SV_WC_API_Request $request ) use ( $filter_value ) {
					return $filter_value;
				}, 10, 2 );
		}

		$this->assertEquals( $expected, $api->is_request_cacheable() );
	}

	/**
	 * Data provider for {@see CacheableAPIBaseTest::test_is_request_cacheable()}.
	 *
	 * @return array[]
	 */
	public function provider_is_request_cacheable() : array
	{
		return [
			'cacheable request, no filtering'          => [true, null, true],
			'non-cacheable request, no filtering'      => [false, null, false],
			'cacheable request, filtering to false'    => [true, false, false],
			'non-cacheable request, filtering to true' => [false, true, false],
		];
	}


	/**
	 * Gets a test request instance using the CacheableRequestTrait.
	 */
	protected function get_new_request_instance( $cacheable = true ) {
		return $cacheable
			? new class extends SV_WC_API_JSON_Request {
				use Cacheable_Request_Trait;
			}
			: $this->getMockForAbstractClass( SV_WC_API_JSON_Request::class );
	}

	/**
	 * Gets a test request instance using the CacheableRequestTrait.
	 */
	protected function get_new_api_instance() {
		$api = $this->getMockForAbstractClass( Abstract_Cacheable_API_Base::class );

		$api->method('get_plugin')->willReturn( sv_wc_test_plugin() );

		return $api;
	}
}

