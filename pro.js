const { KafkaClient, Producer } = require('kafka-node');
const avro = require('avsc');

const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(kafkaClient);

const schemaRegistryUrl = 'http://localhost:8081'; // 스키마 레지스트리의 URL

// AVRO 스키마 정의
const avroSchema = {
    type: 'record',
    name: 'user',
    namespace: "com.user",
    fields: [
        { name: 'id', type: 'string' },
        { name: 'value', type: 'string' }
    ]
};

const schema = avro.Type.forSchema(avroSchema);

producer.on('ready', async () => {
    console.log('Producer is ready');

    const message = {
        id: '1',
        value: 'Hello from Kafka with Avro schema!'
    };

    try {
        // 스키마 레지스트리에 스키마 등록 및 ID 가져오기
        const response = await fetch(`${schemaRegistryUrl}/subjects/topic4-value/versions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.schemaregistry.v1+json'
            },
            body: JSON.stringify({
                schema: JSON.stringify(avroSchema)
            })
        });

        const { id } = await response.json();

        console.log(id)



        // 메시지 전송
        const payloads = [
            {
                topic: 'topic4',
                messages: schema.toBuffer(message),
                key: id
            }
        ];

        producer.send(payloads, (err, data) => {
            if (err) {
                console.error('Error sending message', err);
            } else {
                console.log('Message sent:', data);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
});

producer.on('error', (err) => {
    console.error('Error:', err);
});
