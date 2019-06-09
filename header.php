<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package ryanblog
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'ryanblog' ); ?></a>

	<header id="masthead" class="site-header">
        <div class="container">
            <div class="row header-page-main-wrap">
                <div class="site-branding col-sm-4">
                    <?php
                    the_custom_logo();
                    $ryanblog_description = get_bloginfo( 'description', 'display' );
                    if ( $ryanblog_description || is_customize_preview() ) :
                        ?>
                        <p class="site-description"><?php echo $ryanblog_description; /* WPCS: xss ok. */ ?></p>
                    <?php endif; ?>
                </div><!-- .site-branding -->
                <nav id="site-navigation" class="main-navigation">
                    <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><div class=""><span></span><span></span><span></span><span></span></div></button>
                    <?php
                    wp_nav_menu( array(
                        'theme_location' => 'menu-1',
                        'menu_id'        => 'primary-menu',
                    ) );
                    ?>
                </nav><!-- #site-navigation -->
            </div>
        </div>
	</header><!-- #masthead -->

	<div id="content" class="site-content">
        <div class="container">
            <div class="row content-page-main-wrap">