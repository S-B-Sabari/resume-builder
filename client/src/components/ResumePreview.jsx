import React, { useRef, useState, useEffect, useCallback } from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ModernImageTemplate from './templates/ModernImageTemplate'
import ApolloTemplate from './templates/ApolloTemplate'
import TerraTemplate from './templates/TerraTemplate'
import TraditionalTemplate from './templates/TraditionalTemplate'
import PrimeATS from './templates/PrimeATS'
import PureATS from './templates/PureATS'
import MonochromeCenter from './templates/MonochromeCenter'
import MonochromeDivided from './templates/MonochromeDivided'
import ModernSidebar from './templates/ModernSidebar'

// A4 at 96 dpi:  210 mm × 297 mm  →  794 × 1123 px
const A4_W = 794
const A4_H = 1123
const GAP  = 20        // visual gap between pages (in real px, not scaled)

// Document margins shown as white overlay bands
const MARGIN_TOP    = 76  // ≈ 20 mm
const MARGIN_BOTTOM = 76
const CONTENT_H     = A4_H - MARGIN_TOP - MARGIN_BOTTOM  // 971 px usable per page

const ResumePreview = ({ data, template, accentColor, classes = '', removeBackground }) => {

    const wrapperRef = useRef(null)   // container that controls scale
    const contentRef = useRef(null)   // measures full template height
    const [scale, setScale] = useState(1)
    const [pages, setPages] = useState(1)

    // ── Scale to fit container width — never upscale ──
    const recalcScale = useCallback(() => {
        if (!wrapperRef.current) return
        const availW = wrapperRef.current.clientWidth
        setScale(Math.min(1, availW / A4_W))
    }, [])

    useEffect(() => {
        recalcScale()
        const ro = new ResizeObserver(recalcScale)
        if (wrapperRef.current) ro.observe(wrapperRef.current)
        return () => ro.disconnect()
    }, [recalcScale])

    // ── Count pages ──
    useEffect(() => {
        const el = contentRef.current
        if (!el) return
        const ro = new ResizeObserver(() => {
            setPages(Math.max(1, Math.ceil(el.scrollHeight / CONTENT_H)))
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [data, template, accentColor, removeBackground])

    const renderTemplate = () => {
        const props = { data, accentColor, removeBackground }
        switch (template) {
            case 'modern':             return <ModernTemplate       {...props} />
            case 'minimal':            return <MinimalTemplate       {...props} />
            case 'minimal-image':      return <MinimalImageTemplate  {...props} />
            case 'modern-image':       return <ModernImageTemplate   {...props} />
            case 'apollo':             return <ApolloTemplate        {...props} />
            case 'terra':              return <TerraTemplate         {...props} />
            case 'traditional':        return <TraditionalTemplate   {...props} />
            case 'prime-ats':          return <PrimeATS              {...props} />
            case 'pure-ats':           return <PureATS               {...props} />
            case 'monochrome-center':  return <MonochromeCenter      {...props} />
            case 'monochrome-divided': return <MonochromeDivided     {...props} />
            case 'modern-sidebar':     return <ModernSidebar         {...props} />
            default:                   return <ClassicTemplate       {...props} />
        }
    }

    /*
      Each page card is rendered at full A4 size (794 × 1123) and then
      shrunk via `transform: scale(scale)` + `transform-origin: top center`.
      Because CSS transform doesn't affect layout flow we also collapse the
      extra space with negative margin-bottom.
      The outer wrapper is just `width: 100%` — no fixed height — so the
      page naturally pushes the document and the user can scroll down.
    */
    const scaledH       = A4_H * scale          // actual rendered height after scaling
    const collapsePx    = A4_H - scaledH        // pixels to pull back via negative margin
    const gapPx         = GAP                   // gap between cards at actual page scroll

    return (
        <div
            ref={wrapperRef}
            className={'resume-scale-wrapper' + (classes ? ' ' + classes : '')}
            style={{
                width:      '100%',
                background: '#d1d5db',
                padding:    '16px 0',
                overflow:   'visible',
                display:    'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap:        gapPx,
            }}
        >
            {Array.from({ length: pages }).map((_, i) => (
                /*
                  Outer shrink-wrap: collapses to the *scaled* height so pages
                  stack correctly without gaps caused by the full-size ghost area.
                */
                <div
                    key={i}
                    style={{
                        width:        A4_W * scale,
                        height:       scaledH,
                        flexShrink:   0,
                        position:     'relative',
                        overflow:     'hidden',
                    }}
                >
                    {/*
                      Inner card at true A4 size — scaled down via transform.
                      transform-origin: top left keeps it anchored at the top-left
                      of the shrink-wrap container.
                    */}
                    <div
                        style={{
                            width:           A4_W,
                            height:          A4_H,
                            position:        'absolute',
                            top:             0,
                            left:            0,
                            transform:       `scale(${scale})`,
                            transformOrigin: 'top left',
                            background:      '#fff',
                            boxShadow:       '0 2px 18px rgba(0,0,0,0.18)',
                            overflow:        'hidden',
                        }}
                    >
                        {/* Template content — sliced to show only this page */}
                        <div
                            ref={i === 0 ? contentRef : undefined}
                            style={{
                                position: 'absolute',
                                top:      MARGIN_TOP - (i * CONTENT_H),
                                left:     0,
                                width:    A4_W,
                            }}
                        >
                            {renderTemplate()}
                        </div>

                        {/* ── TOP white margin band ── */}
                        <div style={{
                            position:      'absolute',
                            top:           0, left: 0, right: 0,
                            height:        MARGIN_TOP,
                            background:    '#fff',
                            zIndex:        20,
                            pointerEvents: 'none',
                            borderBottom:  '1px dashed rgba(156,163,175,0.45)',
                        }} />

                        {/* ── BOTTOM white margin band ── */}
                        <div style={{
                            position:      'absolute',
                            bottom:        0, left: 0, right: 0,
                            height:        MARGIN_BOTTOM,
                            background:    '#fff',
                            zIndex:        20,
                            pointerEvents: 'none',
                            borderTop:     '1px dashed rgba(156,163,175,0.45)',
                        }}>
                            {/* Page label inside bottom band */}
                            <div style={{
                                position:      'absolute',
                                bottom:        14, left: 0, right: 0,
                                textAlign:     'center',
                                fontSize:      9,
                                color:         '#9ca3af',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                fontFamily:    'monospace',
                                pointerEvents: 'none',
                            }}>
                                {pages > 1 ? `Page ${i + 1} of ${pages}` : 'A4'}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {pages > 1 && (
                <p style={{ fontSize: 11, color: '#4b5563', margin: 0, fontWeight: 500 }}>
                    {pages} pages · A4
                </p>
            )}

            {/* ── Print CSS ── */}
            <style>{`
                @page {
                    size: A4;
                    margin: ${MARGIN_TOP}px 0 ${MARGIN_BOTTOM}px 0;
                }
                @media print {
                    html, body {
                        width: ${A4_W}px;
                        height: auto;
                        overflow: visible;
                        background: #fff !important;
                    }
                    body * { visibility: hidden; }
                    #resume-print-target,
                    #resume-print-target * { visibility: visible; }
                    #resume-print-target {
                        position: absolute;
                        top: 0; left: 0;
                        width: ${A4_W}px;
                        height: auto;
                        overflow: visible;
                        transform: none !important;
                    }
                    .resume-scale-wrapper { display: none !important; }
                    section { break-inside: avoid; }
                }
            `}</style>

            {/* Hidden full-resolution clone used only when printing */}
            <div
                id="resume-print-target"
                style={{
                    position:      'fixed',
                    left:          -99999,
                    top:           0,
                    width:         A4_W,
                    visibility:    'hidden',
                    pointerEvents: 'none',
                }}
            >
                {renderTemplate()}
            </div>
        </div>
    )
}

export default ResumePreview
