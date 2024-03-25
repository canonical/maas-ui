import { useCallback, useEffect } from "react";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import type { UsabillaLive } from "@/app/base/types";
import authSelectors from "@/app/store/auth/selectors";
import configSelectors from "@/app/store/config/selectors";
import { version as versionSelectors } from "@/app/store/general/selectors";

declare global {
  interface Window {
    ga: (...args: unknown[]) => void;
    lightningjs: {
      require: (variable: string, url: string) => Window["usabilla_live"];
    };
    usabilla_live: UsabillaLive;
  }
}

export type SendAnalytics = (
  eventCategory?: string,
  eventAction?: string,
  eventLabel?: string
) => void;

/**
 * Send a google analytics event
 * @param eventCategory - The analytics category.
 * @param eventAction - The analytics action.
 * @param eventLabel - The analytics label.
 */
const sendAnalytics = (
  eventCategory = "",
  eventAction = "",
  eventLabel = ""
) => {
  window.ga &&
    window.ga("send", "event", eventCategory, eventAction, eventLabel);
};

/**
 * Send an analytics event if analytics config is enabled
 */
export const useSendAnalytics = (): SendAnalytics => {
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  return useCallback(
    (eventCategory?, eventAction?, eventLabel?) => {
      if (analyticsEnabled && eventCategory && eventAction && eventLabel) {
        sendAnalytics(eventCategory, eventAction, eventLabel);
      }
    },
    [analyticsEnabled]
  );
};

/**
 * Send an analytics event if a condition is met
 * @param sendCondition - Whether an analytics event is sent.
 * @param eventCategory - The analytics category.
 * @param eventAction - The analytics action.
 * @param eventLabel - The analytics label.
 */
export const useSendAnalyticsWhen = (
  sendCondition?: boolean,
  eventCategory?: string,
  eventAction?: string,
  eventLabel?: string
): void => {
  const sendAnalytics = useSendAnalytics();

  useEffect(() => {
    if (sendCondition) {
      sendAnalytics(eventCategory, eventAction, eventLabel);
    }
  }, [eventCategory, eventAction, eventLabel, sendCondition, sendAnalytics]);
};

export const useGoogleAnalytics = (): boolean => {
  const location = useLocation();
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const authUser = useSelector(authSelectors.get);
  const uuid = useSelector(configSelectors.uuid);
  const version = useSelector(versionSelectors.get);
  const debug = import.meta.env.NODE_ENV === "development";
  const allowGoogleAnalytics = !!(
    analyticsEnabled &&
    authUser &&
    uuid &&
    version &&
    !debug
  );

  useEffect(() => {
    if (allowGoogleAnalytics) {
      (function (w, d, s, l, i) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        w[l] = w[l] || [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        const f = d.getElementsByTagName(s)[0],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          j = d.createElement(s),
          dl = l !== "dataLayer" ? "&l=" + l : "";
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        j.async = true;
        const src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        j.src = src;
        if (document.querySelectorAll(`script[src="${src}"]`).length === 0) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          f.parentNode.insertBefore(j, f);
        }
      })(window, document, "script", "dataLayer", "GTM-P4TGJR9");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.ga =
        window.ga ||
        function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line prefer-rest-params
          (window.ga.q = window.ga.q || []).push(arguments);
          return window.ga;
        };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.ga.l = +new Date();
      window.ga("create", "UA-1018242-63", "auto", {
        userId: `${uuid}-${authUser.id}`,
      });
      window.ga("set", "dimension1", version);
      window.ga("set", "dimension2", uuid);

      window.ga(
        "send",
        "pageview",
        window.location.pathname + window.location.search
      );
    }
  }, [allowGoogleAnalytics, authUser, uuid, version]);

  useEffect(() => {
    window.ga &&
      window.ga(
        "send",
        "pageview",
        window.location.pathname + window.location.search
      );
  }, [location.pathname, location.search]);

  return allowGoogleAnalytics;
};

export const useUsabilla = (): boolean => {
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const version = useSelector(versionSelectors.get);
  const debug = import.meta.env.NODE_ENV === "development";
  const allowUsabilla = !!(analyticsEnabled && !debug);

  useEffect(() => {
    if (allowUsabilla && version) {
      // Inject the the Usabilla script.
      // prettier-ignore
      // eslint-disable-next-line
      // @ts-ignore
      // eslint-disable-next-line
      window.lightningjs||function(n){var e="lightningjs";function t(e,t){var r,i,a,o,d,c;return t&&(t+=(/\?/.test(t)?"&":"?")+"lv=1"),n[e]||(r=window,i=document,a=e,o=i.location.protocol,d="load",c=0,function(){n[a]=function(){var t=arguments,i=this,o=++c,d=i&&i!=r&&i.id||0;function s(){return s.id=o,n[a].apply(s,arguments)}return(e.s=e.s||[]).push([o,d,t]),s.then=function(n,t,r){var i=e.fh[o]=e.fh[o]||[],a=e.eh[o]=e.eh[o]||[],d=e.ph[o]=e.ph[o]||[];return n&&i.push(n),t&&a.push(t),r&&d.push(r),s},s};var e=n[a]._={};function s(){e.P(d),e.w=1,n[a]("_load")}e.fh={},e.eh={},e.ph={},e.l=t?t.replace(/^\/\//,("https:"==o?o:"http:")+"//"):t,e.p={0:+new Date},e.P=function(n){e.p[n]=new Date-e.p[0]},e.w&&s(),r.addEventListener?r.addEventListener(d,s,!1):r.attachEvent("onload",s);var l=function(){function n(){return["<!DOCTYPE ",o,"><",o,"><head></head><",t,"><",r,' src="',e.l,'"></',r,"></",t,"></",o,">"].join("")}var t="body",r="script",o="html",d=i[t];if(!d)return setTimeout(l,100);e.P(1);var c,s=i.createElement("div"),h=s.appendChild(i.createElement("div")),u=i.createElement("iframe");s.style.display="none",d.insertBefore(s,d.firstChild).id="lightningjs-"+a,u.frameBorder="0",u.id="lightningjs-frame-"+a,/MSIE[ ]+6/.test(navigator.userAgent)&&(u.src="javascript:false"),u.allowTransparency="true",h.appendChild(u);try{u.contentWindow.document.open()}catch(n){e.domain=i.domain,c="javascript:var d=document.open();d.domain='"+i.domain+"';",u.src=c+"void(0);"}try{var p=u.contentWindow.document;p.write(n()),p.close()}catch(e){u.src=c+'d.write("'+n().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}e.P(2)};e.l&&l()}()),n[e].lv="1",n[e]}var r=window.lightningjs=t(e);r.require=t,r.modules=n}({});
      window.usabilla_live = window.lightningjs.require(
        "usabilla_live",
        `//w.usabilla.com/${import.meta.env.VITE_APP_USABILLA_ID}.js`
      ); // prettier-ignore
      // Hide Usabilla default button
      window.usabilla_live("hide");
      // Add MAAS version to the custom data
      window.usabilla_live("data", { custom: { "MAAS version": version } });
    }
  }, [allowUsabilla, version]);

  return allowUsabilla;
};
