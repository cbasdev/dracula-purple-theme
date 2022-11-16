class OnBoardingCPWidget {
  constructor({ bus, trigger, isNewBuyer, isMobile, tr, locale, domain, siteId, isInferred }) {
    this.bus = bus || window.freya;
    this.container = document.body;
    this.tr = {};
    this.domain = domain;
    this.isMobile = !!isMobile;
    this.isNewBuyer = isNewBuyer;
    this.melidataTrack = window.melidata || function () {};
    this.gaTrack = window.meli_ga || function () {};

    const tooltipConfig = enableTooltip[`${siteId}`];
    this.showNewBuyer = isNewBuyer && tooltipConfig && tooltipConfig.newBuyer && !isInferred;
    this.showWithAddresses = (!isNewBuyer && tooltipConfig && tooltipConfig.withAddress) || isInferred;

    const { common, ...translationsRest } = translations;
    Object.keys(translationsRest).forEach((key) => {
      translationsRest[`${key}`] = { ...common, ...translationsRest[`${key}`] };
    });

    [translationsRest[locale || 'es_AR'], tr].forEach((source) => {
      if (source) {
        Object.keys(source).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            this.tr[`${key}`] = source[`${key}`];
          }
        });
      }
    });

    this.trigger = document.querySelector(trigger || '.nav-menu-cp');

    if (this.trigger) {
      if (!this.hasCookie()) {
        let content = null;
        if (this.showNewBuyer) {
          content = this.newBuyerContent(isMobile);
        } else if (this.showWithAddresses) {
          content = this.withAddressesContent(isMobile);
        }
        if (content) {
          this.createTooltip(content);
          this.trackOpenTooltip();
          window.addEventListener('resize', () => {
            this.updateTooltipPosition();
          });
        }
      }

      this.trigger.addEventListener('click', () => {
        this.hide();
      });

      const menu = document.querySelector('[for=nav-header-menu-switch]');
      if (isMobile && menu) {
        menu.addEventListener('click', () => {
          if (this.wrapper) {
            this.container.removeChild(this.wrapper);
            this.wrapper = null;
          }
        });
      }
    }

    /**
    * Add bus listeners
    */
    this.bus.on('onboarding-cp:hide', () => this.hide());
  }

  newBuyerContent(isMobile) {
    const content = {};
    content.title = this.tr.title_new_buyer;
    content.text = this.tr.text_new_buyer;
    content.primaryButton = isMobile ? '' : buttonTemplate({
      text: this.tr.enter,
      type: 'filled',
      dataJS: 'onboarding-cp-open',
      dataOrigin: 'header',
    });
    content.secondaryButton = '';
    content.closeButton = isMobile ? '' : {
      text: this.tr.close,
      dataJS: 'onboarding-cp-close',
      dataOrigin: 'cross',
    };
    return content;
  }

  withAddressesContent(isMobile) {
    const content = {};
    content.title = this.tr.title;
    content.text = '';
    content.primaryButton = buttonTemplate({
      text: this.tr.understand,
      type: 'filled',
      dataJS: 'onboarding-cp-close',
      dataOrigin: 'header',
    });
    content.secondaryButton = buttonTemplate({
      text: this.tr.modify_cp,
      type: 'outline',
      dataJS: 'onboarding-cp-open',
      dataOrigin: 'header',
    });
    content.closeButton = {
      text: this.tr.close,
      dataJS: 'onboarding-cp-close',
      dataOrigin: 'cross',
    };
    return content;
  }

  /**
   * Create DOM elements
   */
  createTooltip(content) {
    const { title, text, primaryButton, secondaryButton, closeButton } = content;
    const toopltipPosition = this.getTooltipPosition(this.trigger);
    // Wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'onboarding-cp';
    this.wrapper.insertAdjacentHTML('beforeend', tooltipTemplate({
      title,
      text,
      primaryButton,
      secondaryButton,
      closeButton,
      ...toopltipPosition,
      onClose: this.hide,
      wrapperClass: this.showNewBuyer ? 'onboarding-cp-tooltip-new-buyer' : '',
    }));
    this.container.appendChild(this.wrapper);

    const elementsOpenCP = document.querySelectorAll('[data-js="onboarding-cp-open"]');
    if (elementsOpenCP && elementsOpenCP.length > 0) {
      for (let i = 0; i < elementsOpenCP.length; i += 1) {
        const element = elementsOpenCP[`${i}`];
        element.addEventListener('click', this.openCP.bind(this));
      }
    }

    const elementsCloseOnboarding = document.querySelectorAll('[data-js="onboarding-cp-close"]');
    if (elementsCloseOnboarding && elementsCloseOnboarding.length > 0) {
      for (let j = 0; j < elementsCloseOnboarding.length; j += 1) {
        const element = elementsCloseOnboarding[`${j}`];
        element.addEventListener('click', this.hide.bind(this));
      }
    }
  }

  getTooltipPosition() {
    const triggerOffset = this.trigger.getBoundingClientRect();
    const calculateScroll = (window.scrollY || document.body.scrollTop || 0);
    return {
      top: `${triggerOffset.top + this.trigger.offsetHeight + 10 + calculateScroll}px`,
      left: `${triggerOffset.left + 8}px`,
    };
  }

  updateTooltipPosition() {
    const tooltip = document.querySelector('.onboarding-cp-tooltip');
    const toopltipPosition = this.getTooltipPosition();
    if (tooltip) {
      tooltip.style.top = toopltipPosition.top;
      tooltip.style.left = toopltipPosition.left;
    }
  }

  hide(e) {
    if (e) {
      e.preventDefault();
    }
    if (!this.hasCookie()) {
      if (e) {
        this.gaTrack('send', 'event', 'CURRENT_LOCATION', 'CLOSE_ONBOARDING', e.target.dataset.origin.toUpperCase());
        this.melidataTrack('cleanAndSend', 'event', {
          path: '/current_location/navigation/close_onboarding',
          event_data: {
            type: this.isNewBuyer ? 'newbie' : 'location',
            origin: e.target.dataset.origin,
          },
        });
      } else {
        this.gaTrack('send', 'event', 'CURRENT_LOCATION', 'PICK_ONBOARDING', 'HEADER');
        this.melidataTrack('cleanAndSend', 'event', {
          path: '/current_location/navigation/pick_onboarding',
          event_data: {
            type: this.isNewBuyer ? 'newbie' : 'location',
            origin: 'header',
          },
        });
      }


      if (this.wrapper) {
        this.container.removeChild(this.wrapper);
        this.wrapper = null;
      }
      this.addCookie();
    }
  }

  openCP(e) {
    e.preventDefault();
    this.gaTrack('send', 'event', 'CURRENT_LOCATION', 'PICK_ONBOARDING', e.target.dataset.origin.toUpperCase());
    this.melidataTrack('cleanAndSend', 'event', {
      path: '/current_location/navigation/pick_onboarding',
      event_data: {
        type: this.isNewBuyer ? 'newbie' : 'location',
        origin: e.target.dataset.origin,
      },
    });
    this.addCookie();
    if (this.wrapper) {
      this.container.removeChild(this.wrapper);
      this.wrapper = null;
    }
    this.bus.emit('modal-cp:show');
  }

  addCookie() {
    const date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);

    document.cookie = `onboarding_cp=false; expires=${date}; path=/; domain=.${this.domain};`;
  }

  hasCookie() {
    return document.cookie.indexOf('onboarding_cp=false') !== -1;
  }

  trackOpenTooltip() {
    this.gaTrack('send', 'event', 'CURRENT_LOCATION', 'OPEN_ONBOARDING', 'HEADER');
    this.melidataTrack('cleanAndSend', 'event', {
      path: '/current_location/navigation/open_onboarding',
      event_data: {
        type: this.isNewBuyer ? 'newbie' : 'location',
        origin: 'header',
      },
    });
  }
}