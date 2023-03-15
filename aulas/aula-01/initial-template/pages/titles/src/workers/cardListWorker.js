onmessage = ({ data }) => {
    let counter = 0
    
    console.time('blocking')

    for (; counter < data.maxItems; counter++) console.log('.')
    console.timeEnd('blocking-op')

    console.timeEnd('blocking')

    postMessage({
        reponse: 'ok'
    })
}