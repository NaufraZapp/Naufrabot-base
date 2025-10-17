import { HookifiedOptions, Hookified } from 'hookified';

/**
 * Message interface for the message provider
 * @template T - The type of the message data
 */
type Message<T = any> = {
    /**
     * Unique identifier for the message
     * @type {string}
     */
    id: string;
    /**
     * the provider that passed the message
     */
    providerId: string;
    /**
     * The data of the message
     * @type {<T = any>}
     */
    data: T;
    /**
     * Timestamp of when the message was created
     * @type {number}
     */
    timestamp?: number;
    /**
     * Headers for additional metadata
     * @type {Record<string, string>}
     */
    headers?: Record<string, string>;
};
type TopicHandler = {
    id?: string;
    handler: (message: Message) => Promise<void>;
};
/**
 * MessageProvider interface for the message provider
 */
type MessageProvider = {
    /**
     * The id of the message provider. Use primary when multiple providers
     * are used.
     */
    id: string;
    /**
     * Array of handlers for message processing
     * @type {Map<string, Array<TopicHandler>>}
     */
    subscriptions: Map<string, TopicHandler[]>;
    /**
     * Plublish a message to a topic / queue. This is used to send messages to subscribers.
     * @param topic - The topic or queue to publish the message to
     * @param message - The message to be published
     * @returns {Promise<void>}
     */
    publish(topic: string, message: Omit<Message, "providerId">): Promise<void>;
    /**
     * Subscribe to a topic / queue. This is used to receive messages from the provider.
     * @param {TopicHandler} subscription - The topic or queue to subscribe to
     * @returns {Promise<void>}
     */
    subscribe(topic: string, handler: TopicHandler): Promise<void>;
    /**
     * Remove subscription to a topic / queue.
     * @param topic - The topic or queue to unsubscribe from
     * @param id - Optional unique identifier for the subscription to remove. If not provided, it will remove all subscriptions for the topic.
     * @returns {Promise<void>}
     */
    unsubscribe(topic: string, id?: string): Promise<void>;
    /**
     * Unsubscribe from a topic / queue. This is used to stop receiving messages from the provider.
     * @returns {Promise<void>}
     */
    disconnect(): Promise<void>;
};
/**
 * Task interface for the task provider
 * @template T - The type of the task data
 */
type Task<T = any> = {
    /**
     * Unique identifier for the task
     * @type {string}
     */
    id: string;
    /**
     * The data of the task
     * @type {<T = any>}
     */
    data: T;
    /**
     * Timestamp of when the task was created
     * @type {number}
     */
    channel: string;
    /**
     * Timestamp of when the task was created
     * @type {number}
     */
    priority?: number;
    /**
     * Timestamp of when the task was created
     * @type {number}
     */
    retries?: number;
};
/**
 * TaskProvider interface for the task provider
 */
type TaskProvider = {
    /**
     * Array of handlers for task processing
     * @type {Array<{taskName: string; handler: (payload: Task) => Promise<void>}>}
     */
    taskHandlers: Array<{
        taskName: string;
        handler: (payload: Task) => Promise<void>;
    }>;
    /**
     * Array of handlers for task processing
     * @param config - Configuration object for the provider
     * @returns {Promise<void>}
     */
    init(config: Record<string, any>): Promise<void>;
    /**
     * Publish a task to a queue. This is used to send tasks to subscribers.
     * @param taskName - The name of the task to publish
     * @param payload - The task to be published
     * @returns {Promise<void>}
     */
    enqueue(taskName: string, payload: Task): Promise<void>;
    /**
     * Subscribe to a task. This is used to receive tasks from the provider.
     * @param taskName - The name of the task to subscribe to
     * @param handler - The handler function to process the task
     * @returns {Promise<void>}
     */
    dequeue(taskName: string, handler: (payload: Task) => Promise<void>): Promise<void>;
    /**
     * Disconnect and clean up the provider. This is used to stop receiving tasks from the provider.
     * @returns {Promise<void>}
     */
    disconnect(): Promise<void>;
};

/**
 * Configuration options for the memory message provider.
 */
type MemoryMessageProviderOptions = {
    /**
     * The unique identifier for this provider instance.
     * @default "@qified/memory"
     */
    id?: string;
};
/**
 * In-memory message provider for testing and simple use cases.
 * Messages are stored and delivered synchronously in memory without persistence.
 */
declare class MemoryMessageProvider implements MessageProvider {
    private _subscriptions;
    private _id;
    /**
     * Creates an instance of MemoryMessageProvider.
     * @param {MemoryMessageProviderOptions} options - Optional configuration for the provider.
     */
    constructor(options?: MemoryMessageProviderOptions);
    /**
     * Gets the provider ID for the memory message provider.
     * @returns {string} The provider ID.
     */
    get id(): string;
    /**
     * Sets the provider ID for the memory message provider.
     * @param {string} id The new provider ID.
     */
    set id(id: string);
    /**
     * Gets the subscriptions map for all topics.
     * @returns {Map<string, TopicHandler[]>} The subscriptions map.
     */
    get subscriptions(): Map<string, TopicHandler[]>;
    /**
     * Sets the subscriptions map.
     * @param {Map<string, TopicHandler[]>} value The new subscriptions map.
     */
    set subscriptions(value: Map<string, TopicHandler[]>);
    /**
     * Publishes a message to a specified topic.
     * All handlers subscribed to the topic will be called synchronously in order.
     * @param {string} topic The topic to publish the message to.
     * @param {Message} message The message to publish.
     * @returns {Promise<void>} A promise that resolves when all handlers have been called.
     */
    publish(topic: string, message: Omit<Message, "providerId">): Promise<void>;
    /**
     * Subscribes to a specified topic.
     * @param {string} topic The topic to subscribe to.
     * @param {TopicHandler} handler The handler to process incoming messages.
     * @returns {Promise<void>} A promise that resolves when the subscription is complete.
     */
    subscribe(topic: string, handler: TopicHandler): Promise<void>;
    /**
     * Unsubscribes from a specified topic.
     * If an ID is provided, only the handler with that ID is removed.
     * If no ID is provided, all handlers for the topic are removed.
     * @param {string} topic The topic to unsubscribe from.
     * @param {string} [id] Optional identifier for the subscription to remove.
     * @returns {Promise<void>} A promise that resolves when the unsubscription is complete.
     */
    unsubscribe(topic: string, id?: string): Promise<void>;
    /**
     * Disconnects and clears all subscriptions.
     * @returns {Promise<void>} A promise that resolves when the disconnection is complete.
     */
    disconnect(): Promise<void>;
}

/**
 * Standard events emitted by Qified.
 */
declare enum QifiedEvents {
    error = "error",
    info = "info",
    warn = "warn",
    publish = "publish",
    subscribe = "subscribe",
    unsubscribe = "unsubscribe",
    disconnect = "disconnect"
}
type QifiedOptions = {
    /**
     * The message providers to use.
     */
    messageProviders?: MessageProvider[];
    /**
     * The task providers to use.
     */
    taskProviders?: TaskProvider[];
} & HookifiedOptions;
declare class Qified extends Hookified {
    private _messageProviders;
    /**
     * Creates an instance of Qified.
     * @param {QifiedOptions} options - Optional configuration for Qified.
     */
    constructor(options?: QifiedOptions);
    /**
     * Gets or sets the message providers.
     * @returns {MessageProvider[]} The array of message providers.
     */
    get messageProviders(): MessageProvider[];
    /**
     * Sets the message providers.
     * @param {MessageProvider[]} providers - The array of message providers to set.
     */
    set messageProviders(providers: MessageProvider[]);
    /**
     * Subscribes to a topic. If you have multiple message providers, it will subscribe to the topic on all of them.
     * @param {string} topic - The topic to subscribe to.
     * @param {TopicHandler} handler - The handler to call when a message is published to the topic.
     */
    subscribe(topic: string, handler: TopicHandler): Promise<void>;
    /**
     * Publishes a message to a topic. If you have multiple message providers, it will publish the message to all of them.
     * @param {string} topic - The topic to publish to.
     * @param {Message} message - The message to publish.
     */
    publish(topic: string, message: Omit<Message, "providerId">): Promise<void>;
    /**
     * Unsubscribes from a topic. If you have multiple message providers, it will unsubscribe from the topic on all of them.
     * If an ID is provided, it will unsubscribe only that handler. If no ID is provided, it will unsubscribe all handlers for the topic.
     * @param topic - The topic to unsubscribe from.
     * @param id - The optional ID of the handler to unsubscribe. If not provided, all handlers for the topic will be unsubscribed.
     */
    unsubscribe(topic: string, id?: string): Promise<void>;
    /**
     * Disconnects from all providers.
     * This method will call the `disconnect` method on each message provider.
     */
    disconnect(): Promise<void>;
}

export { MemoryMessageProvider, type Message, type MessageProvider, Qified, QifiedEvents, type QifiedOptions, type TaskProvider, type TopicHandler };
