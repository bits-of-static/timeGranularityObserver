# Time Granularity Observer

Measure javascript timer granularity to eg. throttle resource consumption.

### Motivation

Turn off fancy effects when operating system decides to throttle.

Haven't found anything comparable, which is a shame. You will find everything from high-precision to high-performance, but little that helps coping with life.

*By observing javascript timer resolution?* Will hopefully become obsolete, as libraries and browsers will incorporate this into their codebase. Some mobile-browsers hopefully already do.

### Integration

```
<script src="https://webinjections.informatik-handwerk.de/timeGranularityObserver/latest/autoTransitionNone.js"></script>
```
substitute `latest` for e.g `1.0.0` to get a stable version served on which you can apply [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)

### Files
 - worker.js : TimeGranularityObserver class
 - example.js : add `transition:none` style on body when timer resolution is higher than 25ms
 - autoTransitionNone.js : both files mashed together