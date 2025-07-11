module voting::poll;

use sui::clock::{timestamp_ms, Clock};
use sui::table::{Self, Table};
use std::string::String;
use sui::event::Self;

// Error codes for voting logic
const E_VOTING_CLOSED: u64 = 0;
const E_ALREADY_VOTED: u64 = 1;
const E_INVALID_OPTION: u64 = 2;
const E_POLL_FINALIZED: u64 = 3;
const E_NOT_ADMIN: u64 = 4;
const E_TOO_EARLY: u64 = 5;

// Represents a single poll option
public struct Option has store, copy, drop {
    name: String
}

// Emitted each time a vote is cast
public struct VoteEvent has copy, drop {
    poll_id: ID,
    voter: address,
    option_index: u64,
}

// Main Poll object stored on-chain
public struct Poll has key {
    id: UID,                          // Unique on-chain object ID
    title: String,                    // Poll title
    options: vector<Option>,         // List of poll options
    votes: vector<u64>,              // Vote count per option
    voted: Table<address, bool>,     // Tracks who has voted
    admin: address,                  // Creator of the poll
    deadline: u64,                   // Voting deadline (in ms)
    finalized: bool                  // Indicates if poll is finalized
}

// Initializes and shares a new poll object
public fun create_poll(
    title: String,
    option_names: vector<String>,
    deadline: u64,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let id = object::new(ctx);
    let mut options = vector::empty<Option>();
    let mut votes = vector::empty<u64>();
    let voted_table = table::new<address, bool>(ctx);

    let mut i = 0;
    let n = vector::length(&option_names);

    // Build options and initialize each vote count to 0
    while (i < n) {
        let name = *vector::borrow(&option_names, i);
        let opt = Option { name };                   
        vector::push_back(&mut options, opt);
        vector::push_back(&mut votes, 0);
        i = i + 1;
    };

    let poll = Poll {
        id,
        title,
        options,
        votes,
        voted: voted_table,
        admin: tx_context::sender(ctx),
        deadline: timestamp_ms(clock) + deadline,
        finalized: false
    };

    // Share the poll object so others can interact with it
    transfer::share_object(poll);
}

// Cast a vote for a poll option
public fun vote(
    poll: &mut Poll,
    option_index: u64,
    voter: address,
    clock: &Clock,
) {
    let current_time = timestamp_ms(clock);

    // Ensure poll is still active
    assert!(current_time <= poll.deadline, E_VOTING_CLOSED);

    // Prevent double voting
    assert!(!table::contains(&poll.voted, voter), E_ALREADY_VOTED);

    table::add(&mut poll.voted, voter, true);

    let num_options = vector::length(&poll.options);
    assert!(option_index < num_options, E_INVALID_OPTION);

    // Increment vote count for the selected option
    let vote_ref = vector::borrow_mut(&mut poll.votes, option_index);
    *vote_ref = *vote_ref + 1;

    // Emit vote event to allow off-chain vote tracking
    event::emit(VoteEvent {
        poll_id: object::uid_to_inner(&poll.id),
        voter,
        option_index,
    });
}

// Returns current vote counts for all options
public fun get_results(poll: &Poll): vector<u64> {
    let mut results = vector::empty<u64>();
    let len = vector::length(&poll.votes);
    let mut i = 0;

    // Collect current vote counts into a new vector
    while (i < len) {
        let v = *vector::borrow(&poll.votes, i);
        vector::push_back(&mut results, v);
        i = i + 1;
    };
    
    results
}

// Finalizes the poll, preventing further votes
public fun end_poll(poll: &mut Poll, caller: address, clock: &Clock) {
    let now = timestamp_ms(clock);

    // Only admin can end the poll
    assert!(caller == poll.admin, E_NOT_ADMIN);

    // Poll must be past deadline
    assert!(now > poll.deadline, E_TOO_EARLY);

    // Prevent double-finalization
    assert!(!poll.finalized, E_POLL_FINALIZED);

    poll.finalized = true;
}
