import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.layers import Input, LSTM, Dense
import numpy as np

units = 1000
number_of_notes = 64

'layer 1 is the encoder'
encoder_inputs = Input(shape=(None, 15))
encoder = LSTM(units, return_state=True)
encoder_outputs, encoder_state_h, encoder_state_c = encoder(encoder_inputs)
'encoder_outputs wont be used'

'layer 2 is the decoder'
decoder_inputs = Input(shape=(None, 15))
decoder = LSTM(units, return_sequences=True, return_state=True)
decoder_outputs, decoder_state_h, decoder_state_c = decoder(decoder_inputs, initial_state=[encoder_state_h, encoder_state_c])

'layer 3 is a softmax layer for output'
decoder_dense = Dense(15, activation='softmax')
decoder_outputs = decoder_dense(decoder_outputs)

model = keras.Model([encoder_inputs, decoder_inputs], decoder_outputs)

model.compile(optimizer='rmsprop', loss='categorical_crossentropy', metrics=[keras.metrics.categorical_accuracy])

encoder_model = keras.Model(encoder_inputs, [encoder_state_h, encoder_state_c])

decoder_state_input_h = Input(shape=(units,))
decoder_state_input_c = Input(shape=(units,))
decoder_states_inputs = [decoder_state_input_h, decoder_state_input_c]

decoder_outputs, state_h, state_c = decoder(decoder_inputs, initial_state=decoder_states_inputs)

decoder_states = [state_h, state_c]

decoder_outputs = decoder_dense(decoder_outputs)

decoder_model = keras.Model(
    [decoder_inputs] + decoder_states_inputs,
    [decoder_outputs] + decoder_states)

'function to take sequence of note values and return another one'
'input_seq is (1, 128, 57)'
'output is (128, 57)'


model.load_weights('./music_utils/lstm_units_1000_batch_64_whole_dataset.h5')
print('loaded weights')

def map_notes_to_one_octave(note_values):
    output = np.array(note_values)
    for i in range(0, len(note_values)):
        note = note_values[i]
        if(note == 0):
            output[i] = -1
        else:
            output[i] = note%12
    return output
    
def decode_sequence(input_seq):
    'run encoder to get the state that will be input for the decoder'
    states_value = encoder_model.predict(input_seq)
    
    'decode starts start of sequence vector'
    target = np.zeros((1, 1, 15))
    target[0, 0, 13] = 1
    
    'decoded_sequence contains notes in the output'
    decoded_sequence = np.zeros((number_of_notes, 15))
        
    'loop generates 64 notes'
    for i in range(0, number_of_notes):
        'running decoder to predict next value given target note and input state'
        output_note, h, c = decoder_model.predict([target] + states_value)
        
        'getting note with highest softmax value'
        note_index = np.argmax(output_note)
        
        'updating output sequence'
        decoded_sequence[i, note_index] = 1 
        
        'setting next target to be the previous note'
        target = np.zeros((1, 1, 15))            
        target[0, 0, note_index] = 1
        'updating the decoder input for next iteration'
        states_value = [h, c]
        
    return decoded_sequence



'''read input sequence and write an output sequence that can later be transformed into midi'''

def note_values_to_one_hot_phrase(note_values):
    note_values = map_notes_to_one_octave(note_values)
    ''' 12 is 0, 13 is start, 14 is end '''
    ''' values are between 0 and 11'''
    one_hot_phrase = np.zeros((number_of_notes+2, 15))
    'start of sequence'
    one_hot_phrase[0][13] = 1 
    for i in range (1, len(note_values)+1):
        note = int(note_values[i-1])
        one_hot_note = np.zeros(15)
        if(note == -1):
            one_hot_note[12] = 1
        else:
            one_hot_note[note] = 1
        one_hot_phrase[i] = one_hot_note
    'end of sequence'
    one_hot_phrase[-1][14] = 1 
        
    return one_hot_phrase

def one_hot_phrase_to_note_values(one_hot_phrase):
    ''' 12 is 0, 13 is start, 14 is end '''
    note_values = np.zeros((number_of_notes+2, 1))
    for i in range(0, len(one_hot_phrase)):
        index, = np.where(one_hot_phrase[i] == 1)
        if(len(index) == 0):
            continue
        if(index[0] == 12):
            note_values[i] = 0 
        elif(index[0] == 13):
            note_values[i] = -1
        elif(index[0] == 14):
            note_values[i] = -2
        else:
            note_values[i] = index[0]
    return note_values

def get_music(notes):
    print('here')
    
    custom_input = np.zeros((1, number_of_notes+2, 15))
    custom_output = np.zeros((1, number_of_notes+2, 15))
    custom_input[0] = note_values_to_one_hot_phrase(notes)
    custom_output = decode_sequence(custom_input)

    print(one_hot_phrase_to_note_values(custom_input[0]).T)
    print(one_hot_phrase_to_note_values(custom_output).T)
    return one_hot_phrase_to_note_values(custom_output).tolist()