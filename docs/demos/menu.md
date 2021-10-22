# Menu

<Menu></Menu>

### Code
:::: code-group
::: code-group-item JS
```js
const submenuTriggers = document.querySelectorAll('.js-submenu-trigger');

for (const submenutrigger of submenuTriggers) {
  let f = new Foldable({
    triggers: submenutrigger,
    target: submenutrigger.nextElementSibling,
    enableClickOutside: true,
    useFocusTrap: true,
    open: async ([triggers, target]) => {
      target.classList.add('is-open');
      navburgerFoldable.value.disableEscapeHandler();
      navburgerFoldable.value.disableFocusTrap();
      console.log(navburgerFoldable.value);
    },
    close: async ([triggers, target]) => {
      target.classList.remove('is-open');
      navburgerFoldable.value.enableEscapeHandler();
      navburgerFoldable.value.enableFocusTrap();
    }
  });
  foldables.value.push(f);
}

navburgerFoldable.value = new Foldable({
  triggers: '#js-navburger',
  target: '#js-navburger-target',
  enableClickOutside: true,
  useFocusTrap: true,
  breakpoints: {
    min: 0,
    max: 1023
  },
  classes: {
    closedClass: 'navbruger-closed'
  },
  open: async ([triggers, target]) => {
    target.classList.add('is-open');
  },
  close: async ([triggers, target]) => {
    target.classList.remove('is-open');
  }
});
```
:::
::: code-group-item HTML
```html
<nav id="nav-main" role="navigation">
    <div class="nav-main_container">
        <div>
            <a class="nav-main_logo" href="">Logo</a>
        </div>
        <div id="js-navburger-target" class="menu_container">
            <ul class="menu" aria-label="navbar" role="menubar">
                <li class="menu_item">
                    <a href="#" role="menuitem">Item 1</a>
                </li>
                <li class="menu_item has-submenu">
                    <button class="js-submenu-trigger" type="button" aria-expanded="false">Has submenu 1 <i class="ri-arrow-down-s-line"></i></button>
                    <ul class="submenu" aria-label="submenu" role="menu">
                        <li class="submenu_item">
                            <a href="" role="menuitem" tabindex="-1">Subitem 1</a>
                        </li>
                        <li class="submenu_item">
                            <a href="" role="menuitem" tabindex="-1">Subitem 2</a>
                        </li>
                        <li class="submenu_item">
                            <a href="" role="menuitem" tabindex="-1">Subitem 3</a>
                        </li>
                    </ul>
                </li>
                <li class="menu_item has-submenu">
                    <button class="btn-locales js-submenu-trigger" type="button" aria-expanded="false">Fr <i class="ri-arrow-down-s-line"></i></button>
                    <ul class="submenu" aria-label="lang" role="menu">
                        <li class="submenu_item">
                            <a href="" role="menuitem" tabindex="-1">Fr</a>
                        </li>
                        <li class="submenu_item">
                            <a href="" role="menuitem" tabindex="-1">En</a>
                        </li>
                        <li class="submenu_item">
                            <a href="" role="menuitem" tabindex="-1">De</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <button id="js-navburger" class="navburger" role="button"><span class="navsteak"></span></button>
    </div>
</nav>
```
:::
::: code-group-item SCSS
```scss
@use "sass:math";
@import "../styles/navburger";

$header-height-small: 50px;
$screen-menu-desktop: 1024px;
$nav-main-bg: var(--c-brand);
$header-height: 70px;
$color-primary: var(--c-brand);
$color-secondary: var(--c-brand);
$color-white: white;
$nav-radius: 4px;
$space-1: 4px;
$space-2: 6px;
$space-4: 18px;
$space-5: 22px;
$space-gutter: 24px;

//___ Button
%btn-reset,
.btn-reset {
  appearance: none;
  border: 0;
  line-height: 1.15;
  min-height: 30px;
  background-color: transparent;
}

//___ List
%list-reset,
.list-reset {
  list-style: none;
  padding: 0;
  margin-bottom: 0;
  margin-top: 0;

  li:before {
    content: '';
    display: none;
  }

  li {
    margin-bottom: 0;
  }
}

//___ Link
%link-reset,
.link-reset {
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
}

%menu-item-link {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 30px;
  font-size: inherit;
  font-weight: inherit;
  border-radius: $nav-radius;
  padding: 0 $space-2;
  background-color: transparent;

  &.is-active,
  &:hover {
    background-color: rgba(white, 0.1);
  }

  &:hover:not(.is-active),
  &:focus:not(.is-active) {
    background-color: rgba($color-white, 0.1);
  }
}

#nav-main {
  margin-top: 50px;
  width: 100%;
  background-color: $nav-main-bg;
  z-index: 999;

  @media screen and (min-width: $screen-menu-desktop) {
    height: $header-height;
  }
}

.nav-main_container {
  position: relative;
  height: 100%;
  padding-left: 0;
  padding-right: 0;

  @media screen and (min-width: $screen-menu-desktop) {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    height: $header-height;
    padding-left: $space-gutter;
    padding-right: $space-gutter;

    & > * {
      flex-grow: 0;
      flex-shrink: 1;
      flex-basis: auto;
      max-width: 100%;
      align-self: center;
    }
  }
}

//___ Header_logo
.nav-main_logo {
  display: inline-block;
  vertical-align: middle;
  line-height: $header-height-small;
  height: 100%;
  padding-left: $space-gutter * 0.5;
  color: contrast($nav-main-bg);

  @media screen and (min-width: $screen-menu-desktop) {
    padding-left: 0;
    line-height: $header-height;
  }
}

.nav-main_logo img {
  vertical-align: middle;
  width: auto;
  height: 40px;

  @media screen and (min-width: $screen-menu-desktop) {
    top: auto;
    height: 60px;
  }
}

//___ Header nav
.menu_container {
  display: none; // changed by js
  background-color: rgba(white, 0.2);
  padding-left: $space-gutter * 0.5;
  padding-right: $space-gutter * 0.5;
  padding-bottom: $space-4;
  padding-top: $space-4;

  @media screen and (min-width: $screen-menu-desktop) {
    display: inline-flex;
    position: relative;
    top: 0;
    width: auto;
    background-color: transparent;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
    padding-top: 0;
  }
}

.menu_container.is-open {
  display: block;
}

//___ Menu
.menu {
  @extend %list-reset;
  text-align: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;

  @media screen and (min-width: $screen-menu-desktop) {
    text-align: left;
    width: auto;
    display: inline-flex;
    max-height: $header-height;
  }
}

.menu_item {
  padding: $space-1 0;

  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: 100%;
  max-width: 100%;

  @media screen and (min-width: $screen-menu-desktop) {
    margin: 0 $space-1;
    padding: 0;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;

    &:first-child {
      flex-basis: auto;
      flex-grow: 0;
      padding-bottom: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.menu_item.is-social a {
  padding: $space-1;
}

.menu_item a {
  @extend %link-reset;
  @extend %menu-item-link;
  transition: none;
  color: var(--c-text);

  @media screen and (min-width: $screen-menu-desktop) {
    transition: all ease 400ms;
  }
}

//___ Submenu
.menu_item.has-submenu {
  position: relative;
}

.menu_item.has-submenu > button {
  @extend %btn-reset;
  @extend %menu-item-link;
  color: var(--c-text);
  width: 100%;

  i {
    display: inline-block;
    vertical-align: bottom;
    margin-left: $space-1;
  }

  &:hover {}
}

ul.submenu {
  @extend %list-reset;
  display: none;
  background-color: rgba(white, 0.3);
  padding: $space-1;

  &.is-open {
    display: block;
  }

  @media screen and (min-width: $screen-menu-desktop) {
    position: absolute;
    min-width: 100%;
    border-radius: $nav-radius;
    background-color: $nav-main-bg
  }
}

.submenu > li:not(:first-child) {
  margin-top: $space-1;
}

//___ Locales
.btn-locales {
  @extend %btn-reset;
  position: relative;
  padding-left: 0.5em !important;
  height: auto;
  color: $color-primary;

  & > * {
    display: inline-block;
    vertical-align: middle;
  }

  &:hover {
    background-color: transparent;
  }
}

.lang_choices {
  @extend %list-reset;
  display: block;
  position: absolute;
  top: auto;
  width: 100%;
  border-radius: $nav-radius;
  background-color: $color-primary;
  overflow: hidden;

  li {
    margin-bottom: 0;
  }

  a {
    @extend %menu-item-link;

    &:hover {
      color: $color-white;
      background-color: $color-secondary;
    }
  }

  @media screen and (min-width: $screen-menu-desktop) {
    top: 0;
    bottom: auto;
  }
}
```
:::
::::
