<?php

namespace SkyVerge\WooCommerce\PluginFramework\v5_13_0\Tests\Unit;

use Generator;
use Mockery;
use ReflectionException;
use SkyVerge\WooCommerce\PluginFramework\v5_13_0\Enums\PaymentFormContext;
use SkyVerge\WooCommerce\PluginFramework\v5_13_0\PaymentFormContextChecker;
use SkyVerge\WooCommerce\PluginFramework\v5_13_0\SV_WC_Helper;
use SkyVerge\WooCommerce\PluginFramework\v5_13_0\Tests\TestCase;
use WooCommerce;
use WP_Mock;

class PaymentFormContextCheckerTest extends TestCase
{
	/** @var Mockery\MockInterface&PaymentFormContextChecker */
	private $testObject;

	private array $originalGet;

	public function setUp() : void
	{
		parent::setUp();

		require_once PLUGIN_ROOT_DIR.'/woocommerce/payment-gateway/PaymentFormContextChecker.php';

		$this->testObject = Mockery::mock(PaymentFormContextChecker::class)
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->originalGet = $_GET;
	}

	public function tearDown() : void
	{
		parent::tearDown();

		$_GET = $this->originalGet;
	}

	/**
	 * @covers \SkyVerge\WooCommerce\PluginFramework\v5_13_0\PaymentFormContextChecker::getContextSessionKeyName()
	 * @throws ReflectionException
	 */
	public function testCanGetContextSessionKeyName() : void
	{
		$this->setInaccessiblePropertyValue($this->testObject, 'gatewayId', 'TEST_GATEWAY_ID');

		$this->assertSame(
			'wc_TEST_GATEWAY_ID_payment_form_context',
			$this->invokeInaccessibleMethod($this->testObject, 'getContextSessionKeyName')
		);
	}

	/**
	 * @covers \SkyVerge\WooCommerce\PluginFramework\v5_13_0\PaymentFormContextChecker::maybeSetContext()
	 */
	public function testCanSetContext() : void
	{
		$this->testObject->expects('getCurrentPaymentFormContext')
			->once()
			->andReturn('TEST_FORM_CONTEXT');

		$this->testObject->expects('getContextSessionKeyName')
			->once()
			->andReturn('TEST_CONTEXT_SESSION_KEY_NAME');

		WP_Mock::userFunction('WC')
			->once()
			->andReturn($wooCommerce = Mockery::mock(WooCommerce::class));

		$session = Mockery::mock('WC_Session');
		$session->expects('set')
			->once()
			->with('TEST_CONTEXT_SESSION_KEY_NAME', 'TEST_FORM_CONTEXT');

		$wooCommerce->session = $session;

		$this->testObject->maybeSetContext();

		$this->assertConditionsMet();
	}

	/**
	 * @covers \SkyVerge\WooCommerce\PluginFramework\v5_13_0\PaymentFormContextChecker::getCurrentPaymentFormContext()
	 *
	 * @dataProvider providerCanGetCurrentPaymentFormContext
	 *
	 * @throws ReflectionException
	 */
	public function testCanGetCurrentPaymentFormContext(
		bool $isCheckoutPayPage,
		bool $isCheckout,
		array $getParams,
		?string $expected
	) : void {
		$this->mockStaticMethod(SV_WC_Helper::class, 'isCheckoutPayPage')
			->once()
			->andReturn($isCheckoutPayPage);

		$_GET = $getParams;

		WP_Mock::userFunction('is_checkout')
			->zeroOrMoreTimes()
			->andReturn($isCheckout);

		$this->assertSame(
			$expected,
			$this->invokeInaccessibleMethod($this->testObject, 'getCurrentPaymentFormContext')
		);
	}

	/** @see testCanGetCurrentPaymentFormContext */
	public function providerCanGetCurrentPaymentFormContext() : Generator
	{
		yield 'customer pay page' => [
			'isCheckoutPayPage' => true,
			'isCheckout'        => true,
			'getParams'         => ['pay_for_order' => 'yes'],
			'expected'          => PaymentFormContext::CustomerPayPage,
		];

		yield 'checkout pay page' => [
			'isCheckoutPayPage' => true,
			'isCheckout'        => true,
			'getParams'         => [],
			'expected'          => PaymentFormContext::CheckoutPayPage,
		];

		yield 'checkout' => [
			'isCheckoutPayPage' => false,
			'isCheckout'        => true,
			'getParams'         => [],
			'expected'          => PaymentFormContext::Checkout,
		];

		yield 'unknown' => [
			'isCheckoutPayPage' => false,
			'isCheckout'        => false,
			'getParams'         => [],
			'expected'          => null,
		];
	}
}
